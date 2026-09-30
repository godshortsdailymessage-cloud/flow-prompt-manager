# Flow Prompt Manager — Android APK Builder

This project packages the existing Flow Prompt Manager web app as an Android APK using Capacitor.

## Build online with GitHub — no Android Studio

1. Create an empty GitHub repository.
2. Upload all files from this project, including the `.github/workflows/build-apk.yml` file.
3. Open the repository's **Actions** tab.
4. Select **Build Android APK**.
5. Tap **Run workflow**.
6. When the workflow finishes, open the completed run and download the **Flow-Prompt-Manager-APK** artifact.
7. Extract the artifact and install `app-debug.apk` on Android.

The workflow creates the Android project automatically, so an `android/` folder is intentionally not included in this ZIP.

## App details

- App name: Flow Prompt Manager
- Android package ID: com.sasil.flowpromptmanager
- Web files are kept in `www/` unchanged.
