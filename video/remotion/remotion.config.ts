import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
// chrome-headless-shell bawaan Remotion pernah macet di macOS ("Waiting for root component to load"),
// jadi kit ini memakai Chrome for Testing. Render pertama mengunduhnya sekali (±190 MB) ke node_modules/.remotion/.
Config.setChromeMode('chrome-for-testing');
