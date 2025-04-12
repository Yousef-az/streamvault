// src/config.ts
export const REGIONAL_OPTIONS: Record<string, string> = {
    north_america: "bouquet_na",
    uk_europe: "bouquet_eu",
    middle_east_arabic: "bouquet_me",
    asia: "bouquet_asia",
    global: "bouquet_global",
};

export const STRIPE_PRICES: Record<string, string> = {
    "1": "price_1RAN1mRt8rNloVVOmKvL8NZy",
    "3": "price_1RAcdYRt8rNloVVOQ9xQz0S2",
    "6": "price_1RAcgVRt8rNloVVOmWWseZbt",
    "12": "price_1RAcLVRt8rNloVVOju32toFh",
    "24": "price_1RAcRhRt8rNloVVOQclunaHF"
};

export const REGION_CONFIG: Record<string, { display: string; emoji: string }> = {
    north_america: { display: "United States (North America)", emoji: "🇺🇸" },
    uk_europe: { display: "Europe / UK", emoji: "🇪🇺" },
    middle_east_arabic: { display: "Middle East / Arabic", emoji: "🇸🇦" },
    asia: { display: "Asia", emoji: "🌏" },
    global: { display: "Global", emoji: "🌐" }
};

export const DEVICE_CONFIG: Record<string, { label: string; emoji: string }> = {
    ios: { label: "Apple Devices", emoji: "🍎" },
    fire_stick: { label: "Fire Stick", emoji: "🔥" },
    android_box: { label: "Android Box", emoji: "📦" },
    smart_tv: { label: "Smart TV", emoji: "📺" },
    android_phone: { label: "Android Phone", emoji: "📲" },
    web_browser: { label: "Windows PC", emoji: "🌐" },
    mag_box: { label: "MAG Box", emoji: "📼" },
    other: { label: "Other", emoji: "✨" },
};

export const DEVICE_INSTRUCTIONS: Record<string, string> = {
    smart_tv: `
    <ol>
      <li>Press the Home button on your remote</li>
      <li>Navigate to the app store on your TV</li>
      <li>Search for and install the "Smart IPTV" app</li>
      <li>Open the Smart IPTV app</li>
      <li>Navigate to Settings > Configuration</li>
      <li>Enter your M3U credentials when prompted</li>
      <li>Save your settings and restart the app</li>
    </ol>
    <p><strong>Note:</strong> Some TV models may require a system restart after installation.</p>
  `,
    fire_stick: `
    <ol>
      <li>From your Fire Stick home screen, search for and install the "Downloader" app</li>
      <li>Open the Downloader app and enter: bit.ly/iptv-player</li>
      <li>Follow the prompts to install the IPTV player</li>
      <li>Open the newly installed IPTV player</li>
      <li>Select "Add Playlist" > "Add M3U URL"</li>
      <li>Enter the URL: http://stream.example.com/get.php?username=[YOUR_USERNAME]&password=[YOUR_PASSWORD]&type=m3u_plus&output=ts</li>
      <li>Replace [YOUR_USERNAME] and [YOUR_PASSWORD] with your credentials</li>
      <li>Save and enjoy your content</li>
    </ol>
  `,
    android_box: `
    <ol>
      <li>Open the Google Play Store on your Android Box</li>
      <li>Search for and install "IPTV Smarters Pro" or "TiviMate"</li>
      <li>Open the installed app</li>
      <li>Select "Add Playlist" or "Add New Playlist"</li>
      <li>Choose "Add M3U URL" or "Add URL"</li>
      <li>Enter your playlist URL with your username and password</li>
      <li>Name your playlist (e.g., "My IPTV")</li>
      <li>Save and enjoy your content</li>
    </ol>
    <p><strong>Tip:</strong> For best performance, connect your Android Box via Ethernet instead of Wi-Fi if possible.</p>
  `,
    ios: `
    <ol>
      <li>Install "IPTV Smarters Pro" from the App Store</li>
      <li>Open the IPTV Smarters Pro app</li>
      <li>Tap on "Add New User"</li>
      <li>Enter a name for your playlist</li>
      <li>Select "M3U URL" as input type</li>
      <li>Enter your M3U URL with your credentials</li>
      <li>Tap "Add User" to save</li>
      <li>Your channels will now load</li>
    </ol>
  `,
    android_phone: `
    <ol>
      <li>Install "IPTV Smarters Pro" from Google Play Store</li>
      <li>Open the app and tap "Add User"</li>
      <li>Enter a name for your profile</li>
      <li>Choose "M3U URL" for playlist type</li>
      <li>Enter your M3U URL with credentials</li>
      <li>Save your configuration</li>
      <li>Your channels will load automatically</li>
    </ol>
    <p><strong>Note:</strong> For casting to a TV, make sure both devices are on the same Wi-Fi network.</p>
  `,
    mag_box: `
    <ol>
      <li>Power on your MAG box</li>
      <li>Go to the Settings menu</li>
      <li>Select "System Settings"</li>
      <li>Navigate to "Servers" or "Portal Settings"</li>
      <li>Enter the portal URL: http://portal.example.com/c/</li>
      <li>If prompted, restart your MAG box</li>
      <li>Your channels should now load automatically</li>
    </ol>
    <p><strong>Important:</strong> Your MAG box is already registered in our system. If you change your MAG box, please contact support.</p>
  `,
    web_browser: `
    <ol>
      <li>Open your preferred web browser (Chrome, Firefox, Safari, etc.)</li>
      <li>Visit: http://watch.blancosphere.com</li>
      <li>Enter your username and password</li>
      <li>Click "Sign In"</li>
      <li>Use the navigation menu to browse channels by category</li>
    </ol>
    <p><strong>Tip:</strong> Bookmark the page for easy access in the future.</p>
  `,
};