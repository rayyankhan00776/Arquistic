# Order Notifications (Google Sheets + Apps Script)

Your site sends the order payload to Google Apps Script (`CONFIG.ordersWebhookUrl`) using `sendBeacon` / `fetch(no-cors)`.

Because the browser request is **opaque** (no readable response), the **correct place** to send a notification is inside the Apps Script webhook **after** the row is successfully appended to the Sheet.

## Option A (Recommended): Email notification (built-in)

1) Open your Google Apps Script project (the one deployed as the Web App URL in `assets/js/config.js`).
2) In `doPost(e)`, after you append the row to the sheet, send an email via `MailApp`.
3) Re-deploy the Web App.

### Example `doPost(e)` (email after append)

```js
const SHEET_NAME = 'Orders';
const NOTIFY_TO_EMAIL = 'your-email@example.com';

function doPost(e) {
  try {
    const body = (e && e.postData && e.postData.contents) ? String(e.postData.contents) : '';
    if (!body.trim()) {
      // Common cause: running doPost() from the Apps Script editor ("Run") where `e` is undefined,
      // or the request was sent with an empty body.
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'Empty request body' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const order = JSON.parse(body);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Minimal columns (adjust to match your current sheet headers)
    sheet.appendRow([
      new Date(),
      order.orderId || '',
      order.fullName || '',
      order.phone || '',
      order.city || '',
      order.total || '',
      (order.items || []).join(' | '),
      order.payment || 'cod',
      order.createdAt || ''
    ]);

    const subject = `New order: ${order.orderId || 'Unknown ID'} (${order.total || ''})`;
    const htmlBody = `
      <h2>New Order Received</h2>
      <p><b>Order ID:</b> ${escapeHtml(order.orderId)}</p>
      <p><b>Name:</b> ${escapeHtml(order.fullName)}</p>
      <p><b>Phone:</b> ${escapeHtml(order.phone)}</p>
      <p><b>City:</b> ${escapeHtml(order.city)}</p>
      <p><b>Total:</b> ${escapeHtml(String(order.total))}</p>
      <p><b>Items:</b><br>${escapeHtml((order.items || []).join('\n')).replace(/\n/g, '<br>')}</p>
      <p><b>Created:</b> ${escapeHtml(order.createdAt)}</p>
    `;

    MailApp.sendEmail({
      to: NOTIFY_TO_EMAIL,
      subject,
      htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Optional: notify yourself on failures too
    MailApp.sendEmail({
      to: NOTIFY_TO_EMAIL,
      subject: 'Order webhook error',
      body: String(err && err.stack ? err.stack : err)
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function escapeHtml(value) {
  const s = String(value ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

Notes:
- The site sends `Content-Type: text/plain;charset=utf-8`, so reading `e.postData.contents` is the simplest.
- You can expand the `appendRow([...])` columns to match your existing sheet.

### Testing (don’t click “Run” on doPost)

If you click **Run** in Apps Script, `doPost(e)` runs without a real HTTP request, so `e` is empty and you’ll see:
`SyntaxError: Unexpected end of JSON input`.

Instead, test by POSTing to your deployed Web App URL:

```bash
curl -i -X POST \
  -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"orderId":"TEST-1","createdAt":"2026-02-28T00:00:00.000Z","currency":"PKR","fullName":"Test User","phone":"03000000000","city":"Karachi","total":12345,"items":["Celeste x1 (PKR 12,345)"],"payment":"cod"}' \
  'PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE'
```

## Troubleshooting (email not received)

### 1) Check if the order row is saved

First confirm the Sheet has a new row for your test order. If the row is NOT saved, the email won’t send either.

### 2) Check Apps Script “Executions” (this shows the real error)

Apps Script → left sidebar → **Executions**.
- If you see an error like **Authorization is required** / **Service invoked too many times** / **Exception**, open it — that’s the reason the email didn’t send.

### 2.1) Verify deployment setting: **Execute as: Me**

Deploy → **Manage deployments** → select your Web App → **Edit**:
- **Execute as:** Me
- **Who has access:** Anyone

If you deploy as “User accessing the web app”, email sending often fails (anonymous users can’t send email).

### 3) Authorize MailApp once (required)

Even if your Web App is deployed, your script owner account must authorize `MailApp` at least once.

Add this helper and click **Run** on `testEmail()` (NOT on `doPost`):

```js
function testEmail() {
  MailApp.sendEmail({
    to: 'arquistic@gmail.com',
    subject: 'Arquistic test email (Apps Script)',
    body: 'If you received this, MailApp is authorized and working.'
  });
}
```

Accept the permission prompt, then try placing an order again.

### 4) Make sure your deployment is updated

If you edited code after deploying, you must deploy the new version:
- Deploy → **Manage deployments** → select your Web App → **Edit** → choose **New version** → Deploy.

### 5) Check Gmail Spam/Promotions

Look in **Spam** and **Promotions** for the notification message.

### 6) Quotas

Apps Script has daily email quotas. If exceeded, email sending fails and will show in **Executions**.

### Optional: log email failures into the sheet

If you want the order to still save even when email fails, wrap the send in its own try/catch and log the error:

```js
let emailStatus = 'sent';
try {
  MailApp.sendEmail({ to: NOTIFY_TO_EMAIL, subject, htmlBody });
} catch (mailErr) {
  emailStatus = `email_failed: ${String(mailErr)}`;
}

// Add emailStatus as an extra column in appendRow
// sheet.appendRow([ ..., emailStatus ]);
```

## Option B: Telegram notification (fast + free)

1) Create a bot with **BotFather** and get `TELEGRAM_BOT_TOKEN`
2) Get your `TELEGRAM_CHAT_ID`
3) After `appendRow`, call Telegram:

```js
const TELEGRAM_BOT_TOKEN = '123:ABC';
const TELEGRAM_CHAT_ID = '123456789';

function notifyTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
  });
}
```

## Option C: Slack notification (Incoming Webhook)

Create a Slack Incoming Webhook URL, then:

```js
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/...';

function notifySlack(text) {
  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ text })
  });
}
```

## Recommended reliability rule

Only notify **after** the sheet write succeeds (after `appendRow`).

## Optional security (recommended)

Because a public Apps Script URL can be spammed, consider requiring a shared secret (e.g. `?key=...`) and rejecting requests without it.
