# EmailJS Setup Guide

This guide will help you set up EmailJS to enable the contact form to send emails directly to your Gmail account.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service (Gmail)
1. In your EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Select "Gmail"
4. Click "Connect Account" and authorize with your Gmail
5. Note down your **Service ID** (something like `service_xxxxxxx`)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template structure:

```
Subject: New Contact Form Message - {{subject}}

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio website contact form.
```

4. Save the template and note down your **Template ID** (something like `template_xxxxxxx`)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (something like `xxxxxxxxxxxxxxxx`)

### Step 5: Update Your Website
1. Open `script.js` file
2. Find line 284-286 and replace the placeholders:

```javascript
const serviceId = 'service_your_service_id'; // Replace with your Service ID
const templateId = 'template_your_template_id'; // Replace with your Template ID  
const publicKey = 'your_public_key'; // Replace with your Public Key
```

3. Save the file

## 🎯 Complete Configuration Example

Here's what your configuration should look like after setup:

```javascript
// In script.js around line 284-286
const serviceId = 'service_abc123def'; // Your actual service ID
const templateId = 'template_xyz789ghi'; // Your actual template ID
const publicKey = 'abcd1234efgh5678'; // Your actual public key
```

## 📧 Email Template Variables

The contact form sends these variables to your email template:

- `{{from_name}}` - Visitor's name
- `{{from_email}}` - Visitor's email address
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_email}}` - Your email (22kt1a0595@gmail.com)

## 🔧 Advanced Email Template

For a more professional look, use this enhanced template:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Portfolio Contact Form Message</h2>
    </div>
    
    <div class="content">
        <p><strong>From:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        
        <h3>Message:</h3>
        <p>{{message}}</p>
    </div>
    
    <div class="footer">
        <p>This message was sent from your portfolio website contact form.</p>
        <p>Visit: <a href="https://your-portfolio-url.com">Portfolio Website</a></p>
    </div>
</body>
</html>
```

## 🛡️ Security & Limitations

### EmailJS Free Plan Limits:
- **200 emails/month** - Perfect for a portfolio site
- **Rate limiting** - Prevents spam
- **Email validation** - Automatic verification

### Security Features:
- **Public key is safe** - Can be exposed in frontend code
- **No server required** - Works entirely from browser
- **Spam protection** - Built-in rate limiting and validation

## 🧪 Testing Your Setup

1. Open your portfolio website
2. Fill out the contact form with test data
3. Check your Gmail inbox for the test email
4. If it doesn't work, check browser console for errors

## 🐛 Troubleshooting

### Common Issues:

1. **"User ID is required"**
   - Make sure you've set the correct Public Key
   - Check that EmailJS script is loaded

2. **"Template not found"**
   - Verify your Template ID is correct
   - Ensure template is published in EmailJS dashboard

3. **"Service not found"**
   - Check your Service ID
   - Make sure Gmail service is properly connected

4. **Emails not arriving**
   - Check spam folder
   - Verify Gmail service is authorized
   - Check EmailJS dashboard for delivery status

### Debug Mode:
Add this to your script.js for debugging:

```javascript
// Add after line 306 in script.js
console.log('EmailJS Config:', { serviceId, templateId, publicKey });
console.log('Form Data:', formObject);
```

## 📋 Alternative Services

If you prefer other services, here are alternatives:

1. **Formspree** - Simple form backend service
2. **Netlify Forms** - If hosting on Netlify
3. **Getform** - Another form handling service
4. **Firebase Functions** - For more complex setups

## 🎉 Success!

Once configured, visitors can:
- Fill out your contact form
- Messages are sent directly to your Gmail
- You receive professional-looking emails
- Form shows success/error messages
- No server or backend required!

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all IDs are correct in the script
3. Test with a simple message first
4. Check EmailJS dashboard for delivery logs

---

**Note**: Keep your EmailJS credentials secure and don't share them publicly. The public key is designed to be client-side safe, but treat service and template IDs with care.
