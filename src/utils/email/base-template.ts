// src/utils/email/base-template.ts
import { Env } from '../../types';
import { REGION_CONFIG, DEVICE_CONFIG } from '../../config';
import { formatDeviceName } from '../helpers';

/**
 * Creates a base email template with all common elements that will be used across device-specific templates.
 *
 * @param deviceType - Type of device (e.g., "android", "ios", "smart_tv", "mag")
 * @param username - User's login username
 * @param password - User's login password
 * @param region - Content region (e.g., "north_america", "uk_europe", etc.)
 * @param subscriptionLength - Length of subscription in months (e.g., "1", "3", "6", "12")
 * @param isRenewal - Whether this is a renewal or new subscription
 * @param deviceSpecificInstructions - HTML string with device-specific setup instructions
 * @param deviceSpecificTip - HTML string with device-specific tip (optional)
 * @param portalUrl - Optional URL to customer portal
 * @param firstName - Optional first name of customer
 * @param serverDomain - Server domain for M3U URL (default: "iptv.blancosphere.com")
 * @returns HTML content for email body
 */
export function createBaseEmailTemplate(
    deviceType: string,
    username: string,
    password: string,
    region: string,
    subscriptionLength: string,
    isRenewal: boolean,
    deviceSpecificInstructions: string,
    deviceSpecificTip?: string,
    portalUrl?: string,
    firstName?: string,
    serverDomain: string = "iptv.blancosphere.com"
): string {
    // Get device-specific configurations
    const regionDisplayName = REGION_CONFIG[region]?.display || region;
    const regionEmoji = REGION_CONFIG[region]?.emoji || "🌍";
    const deviceEmoji = DEVICE_CONFIG[deviceType]?.emoji || "📱";
    const deviceTypeDisplay = DEVICE_CONFIG[deviceType]?.label || formatDeviceName(deviceType);

    // Calculate dates and format URLs
    const expiryDate = new Date(Date.now() + parseInt(subscriptionLength) * 30 * 24 * 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const currentDate = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const currentYear = new Date().getFullYear();
    const m3uUrl = `http://${serverDomain}/get.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&type=m3u_plus&output=ts`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(m3uUrl)}&size=150x150`;
    const greeting = firstName ? `Hello ${firstName},` : "Hello,";

    // Default device-specific tip if none provided
    const tipContent = deviceSpecificTip || `For the best streaming experience, use a stable internet connection with at least 10 Mbps download speed and consider using a wired connection when possible.`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Your ${deviceTypeDisplay} Access Activated</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #2B3241;
      background-color: #F1F5F9;
      margin: 0;
      padding: 0;
    }
    
    .email-container {
      max-width: 640px;
      margin: 0 auto;
      background: linear-gradient(180deg, #FFFFFF 0%, #F9FAFC 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    }
    
    .header {
      position: relative;
      background: linear-gradient(125deg, #0F172A 0%, #1E293B 100%);
      padding: 60px 0 140px;
      text-align: center;
      color: white;
      overflow: hidden;
    }
    
    .header-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 70%);
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 0;
    }
    
    .header-particles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='30' cy='40' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='50' cy='20' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='70' cy='70' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='90' cy='30' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='20' cy='80' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='60' cy='50' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3Ccircle cx='80' cy='10' r='1' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E");
      opacity: 0.4;
      z-index: 1;
    }
    
    .logo-container {
      position: relative;
      z-index: 2;
      margin-bottom: 30px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background-color: white;
      border-radius: 50%;
      padding: 15px;
      box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.1);
    }
    
    .header-title {
      position: relative;
      z-index: 2;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      padding: 0 20px;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      position: relative;
      z-index: 2;
      font-size: 16px;
      font-weight: 400;
      opacity: 0.8;
      margin: 15px 0 0;
    }
    
    .status-badge {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      background: rgba(56, 189, 248, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38BDF8;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 100px;
      margin-top: 20px;
    }
    
    .status-badge::before {
      content: "";
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #38BDF8;
      border-radius: 50%;
      margin-right: 8px;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
      }
      70% {
        box-shadow: 0 0 0 6px rgba(56, 189, 248, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
      }
    }
    
    .content-wrapper {
      position: relative;
      margin-top: -80px;
      padding: 0 30px 50px;
      z-index: 10;
    }
    
    .content {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #0F172A;
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .intro-text {
      font-size: 16px;
      line-height: 1.7;
      color: #475569;
      margin-bottom: 30px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 20px;
    }
    
    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      border-radius: 10px;
      margin-right: 12px;
      color: white;
      font-size: 18px;
    }
    
// For the credential cards, ensure the grid styling is consistent:
.credentials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 30px;
  width: 100%; /* Add this to ensure full width */
}
    
.credential-card {
  background: #F8FAFC;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
  width: 100%; /* Add this to ensure full width */
  box-sizing: border-box; /* Add this to include padding in width calculation */
}
    
    .credential-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      border-color: #CBD5E1;
    }
    
    .credential-label {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
      margin-bottom: 10px;
    }
    
    .credential-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #E2E8F0;
      border-radius: 6px;
      margin-right: 8px;
    }
    
// For the subscription text that appears to have a line break issue:
.credential-value {
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 16px;
  font-weight: 500;
  color: #0F172A;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  word-break: break-word; /* Add this to handle long text */
  white-space: normal; /* Add this to allow wrapping */
}
    
    .qr-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 30px 0;
      padding: 30px;
      background: #F8FAFC;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
    }
    
    .qr-code {
      width: 150px;
      height: 150px;
      padding: 10px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
      margin-bottom: 15px;
    }
    
    .qr-caption {
      font-size: 14px;
      color: #64748B;
      font-weight: 500;
      text-align: center;
    }
    
    .m3u-url {
      font-size: 13px;
      color: #64748B;
      background: white;
      padding: 10px 15px;
      border-radius: 8px;
      border: 1px solid #E2E8F0;
      margin-top: 12px;
      word-break: break-all;
      text-align: center;
      max-width: 300px;
    }
    
    .steps-container {
      background: #F8FAFC;
      border-radius: 16px;
      padding: 30px;
      border: 1px solid #E2E8F0;
    }
    
    .steps-list {
      list-style-type: none;
      counter-reset: steps-counter;
      margin: 0;
      padding: 0;
    }
    
    .step-item {
      position: relative;
      padding-left: 50px;
      margin-bottom: 20px;
      counter-increment: steps-counter;
    }
    
    .step-item:last-child {
      margin-bottom: 0;
    }
    
    .step-item::before {
      content: counter(steps-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }
    
    .step-item:not(:last-child)::after {
      content: "";
      position: absolute;
      left: 16px;
      top: 32px;
      bottom: -12px;
      width: 1px;
      background: #E2E8F0;
    }
    
    .step-content {
      font-size: 15px;
      color: #475569;
      line-height: 1.7;
    }
    
    .tip-box {
      margin-top: 20px;
      background: rgba(56, 189, 248, 0.1);
      border-left: 3px solid #38BDF8;
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 14px;
      color: #0F172A;
    }
    
    .tip-title {
      font-weight: 600;
      color: #0EA5E9;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .tip-title svg {
      margin-right: 8px;
    }
    
    .warning-box {
      background: rgba(244, 63, 94, 0.05);
      border-left: 3px solid #F43F5E;
      padding: 20px;
      border-radius: 12px;
      margin: 30px 0;
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }
    
    .warning-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      background: rgba(244, 63, 94, 0.1);
      border-radius: 50%;
      color: #F43F5E;
      font-size: 20px;
    }
    
    .warning-content {
      flex: 1;
    }
    
    .warning-title {
      font-weight: 600;
      color: #F43F5E;
      margin: 0 0 5px;
      font-size: 16px;
    }
    
    .warning-text {
      margin: 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.6;
    }
    
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }
    
    .tip-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #E2E8F0;
    }
    
    .tip-card-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 15px;
      color: #0F172A;
      margin-bottom: 10px;
    }
    
    .tip-card-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      min-width: 30px;
      background: #F1F5F9;
      border-radius: 8px;
      margin-right: 10px;
    }
    
    .tip-card-text {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0;
    }
    
    .action-container {
      text-align: center;
      margin: 40px 0 20px;
    }
    
    .action-button {
      display: inline-block;
      background: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%);
      color: white;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 100px;
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .action-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
      transition: all 0.3s ease;
    }
    
    .action-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
    }
    
    .action-button:hover::after {
      opacity: 0.5;
    }
    
    .closing {
      text-align: center;
      margin-top: 40px;
      padding-top: 40px;
      border-top: 1px solid #E2E8F0;
    }
    
    .closing-text {
      color: #64748B;
      font-size: 15px;
      line-height: 1.7;
      margin-bottom: 20px;
    }
    
    .signature {
      font-weight: 600;
      color: #0F172A;
      font-size: 16px;
    }
    
    .footer {
      background: #0F172A;
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 25px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
    }
    
    .footer-nav {
      margin: 20px 0;
    }
    
    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
      transition: color 0.3s ease;
    }
    
    .footer-link:hover {
      color: white;
    }
    
    .footer-contact {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .footer-contact a {
      color: #38BDF8;
      text-decoration: none;
    }
    
    .copyright {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    /* Animated elements */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animated {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0F172A;
        color: #E2E8F0;
      }
      
      .email-container {
        background: linear-gradient(180deg, #1E293B 0%, #0F172A 100%);
      }
      
      .header {
        background: linear-gradient(125deg, #0F172A 0%, #0A101E 100%);
      }
      
      .content {
        background: rgba(30, 41, 59, 0.9);
        border-color: rgba(30, 41, 59, 0.7);
      }
      
      .greeting {
        color: #F8FAFC;
      }
      
      .intro-text {
        color: #CBD5E1;
      }
      
      .section-title {
        color: #F8FAFC;
      }
      
      .credential-card {
        background: #1E293B;
        border-color: #334155;
      }
      
      .credential-label {
        color: #94A3B8;
      }
      
      .credential-icon {
        background: #334155;
      }
      
      .credential-value {
        color: #F8FAFC;
        background: #0F172A;
        border-color: #334155;
      }
      
      .qr-container, .steps-container {
        background: #1E293B;
        border-color: #334155;
      }
      
      .qr-code {
        background: #0F172A;
      }
      
      .qr-caption {
        color: #94A3B8;
      }
      
      .m3u-url {
        color: #94A3B8;
        background: #0F172A;
        border-color: #334155;
      }
      
      .step-content {
        color: #CBD5E1;
      }
      
      .step-item:not(:last-child)::after {
        background: #334155;
      }
      
      .tip-box {
        background: rgba(56, 189, 248, 0.1);
        color: #CBD5E1;
      }
      
      .tip-card {
        background: #1E293B;
        border-color: #334155;
      }
      
      .tip-card-title {
        color: #F8FAFC;
      }
      
      .tip-card-icon {
        background: #0F172A;
      }
      
      .tip-card-text {
        color: #94A3B8;
      }
      
      .warning-text {
        color: #CBD5E1;
      }
      
      .closing {
        border-color: #334155;
      }
      
      .closing-text {
        color: #94A3B8;
      }
      
      .signature {
        color: #F8FAFC;
      }
    }
    
    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .header {
        padding: 40px 0 120px;
      }
      
      .content-wrapper {
        padding: 0 15px 30px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .credentials-grid,
      .tips-grid {
        grid-template-columns: 1fr;
      }
      
      .warning-box {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      .action-button {
        width: 100%;
      }
      
      .social-links {
        flex-wrap: wrap;
      }
      
      .footer-link {
        display: block;
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-glow"></div>
      <div class="header-particles"></div>
      
      <div class="logo-container">
        <img src="http://cdn.mcauto-images-production.sendgrid.net/429455c8921109b6/93d072ea-9630-4bcd-a5dc-109486957cdb/1200x1200.png" alt="Blancosphere" class="logo">
      </div>
      
      <h1 class="header-title">${isRenewal ? 'Subscription Renewed' : 'Premium Access Activated'}</h1>
      <p class="header-subtitle">Your gateway to unlimited entertainment</p>
      
      <div class="status-badge">Active • Premium ${deviceTypeDisplay} Access</div>
    </div>
    
    <div class="content-wrapper">
      <div class="content">
        <p class="greeting animated">${greeting}</p>
        
        <p class="intro-text animated delay-1">
          ${isRenewal
        ? `Your premium subscription has been successfully renewed. You continue to have unlimited access to thousands of channels and on-demand content.`
        : `Your premium subscription has been successfully activated. You now have unlimited access to thousands of live channels, on-demand content, and exclusive premium features.`}
        </p>
        
        <div class="section animated delay-2">
          <div class="section-title">
            <div class="section-icon">🔐</div>
            Access Credentials
          </div>
          
          <div class="credentials-grid">
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">👤</div>
                Username
              </div>
              <div class="credential-value">${username}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">🔑</div>
                Password
              </div>
              <div class="credential-value">${password}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">${regionEmoji}</div>
                Region
              </div>
              <div class="credential-value">${regionDisplayName}</div>
            </div>
            
            <div class="credential-card">
              <div class="credential-label">
                <div class="credential-icon">⏳</div>
                Subscription
              </div>
              <div class="credential-value">${subscriptionLength} months (Expires: ${formattedExpiryDate})</div>
            </div>
          </div>
          
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code">
            <div class="qr-caption">Scan to automatically connect on mobile devices</div>
            <div class="m3u-url">${m3uUrl}</div>
          </div>
        </div>
        
        <div class="section animated delay-3">
          <div class="section-title">
            <div class="section-icon">${deviceEmoji}</div>
            Setup Instructions for ${deviceTypeDisplay}
          </div>
          
          <div class="steps-container">
            ${deviceSpecificInstructions}
            
            <div class="tip-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0EA5E9" stroke-width="2"/>
                  <path d="M12 8V12" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round"/>
                  <path d="M12 16H12.01" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Pro Tip
              </div>
              ${tipContent}
            </div>
          </div>
          
          <div class="warning-box">
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
              <h4 class="warning-title">Important</h4>
              <p class="warning-text">For your security, never share your credentials with anyone. Your subscription is for personal use only and sharing access may result in account termination.</p>
            </div>
          </div>
          
          <div class="tips-grid">
            <div class="tip-card">
              <div class="tip-card-title">
                <div class="tip-card-icon">📺</div>
                Optimal Quality
              </div>
              <p class="tip-card-text">Set your player to "Auto" quality for the best balance between quality and streaming stability.</p>
            </div>
            
            <div class="tip-card">
              <div class="tip-card-title">
                <div class="tip-card-icon">📱</div>
                Multi-device Access
              </div>
              <p class="tip-card-text">You can use your subscription on multiple devices, but simultaneous streaming is limited to 1 device at a time.</p>
            </div>
          </div>
        </div>
        
        <div class="action-container animated delay-4">
          ${portalUrl ?
        `<a href="${portalUrl}" class="action-button">Access Your Customer Portal</a>` :
        '<!-- No portal URL provided -->'
    }
        </div>
        
        <div class="closing animated delay-4">
          <p class="closing-text">If you have any questions or need assistance, our support team is available 24/7. Simply reply to this email or contact us through the customer portal.</p>
          <p class="signature">The Blancosphere Team</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="social-links">
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 11.3701C16.1234 12.2023 15.9813 13.0523 15.5938 13.7991C15.2063 14.5459 14.5932 15.1515 13.8416 15.5297C13.0901 15.908 12.2385 16.0397 11.4078 15.906C10.5771 15.7723 9.80977 15.3801 9.21484 14.7852C8.61991 14.1903 8.22773 13.4229 8.09406 12.5923C7.9604 11.7616 8.09206 10.91 8.47032 10.1584C8.84858 9.40691 9.45418 8.7938 10.201 8.4063C10.9478 8.0188 11.7978 7.87665 12.63 8.00006C13.4789 8.12594 14.2649 8.52152 14.8717 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 6.5H17.51" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 9H2V21H6V9Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
      
      <div class="footer-nav">
        <a href="#" class="footer-link">Help Center</a>
        <a href="#" class="footer-link">Terms of Service</a>
        <a href="#" class="footer-link">Privacy Policy</a>
        <a href="#" class="footer-link">Refund Policy</a>
      </div>
      
      <div class="footer-contact">
        Need help? Email us at <a href="mailto:support@blancosphere.com">support@blancosphere.com</a>
      </div>
      
      <div class="copyright">
        &copy; ${currentYear} Blancosphere. All rights reserved. Sent on ${currentDate}.
      </div>
    </div>
  </div>
</body>
</html>`;
}