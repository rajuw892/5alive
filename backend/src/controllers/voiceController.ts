// backend/src/controllers/voiceController.ts
import { Request, Response } from 'express';
import AgoraToken from 'agora-token';

const { RtcTokenBuilder, RtcRole } = AgoraToken;

export const generateVoiceToken = (req: Request, res: Response) => {
  try {
    console.log('📥 Voice token request received:', {
      body: req.body,
      headers: req.headers['content-type']
    });

    const { channelName, uid } = req.body;

    if (!channelName || !uid) {
      console.log('❌ Missing parameters:', { channelName, uid });
      return res.status(400).json({
        error: 'Missing channelName or uid'
      });
    }

    // Read env variables at runtime
    const APP_ID = process.env.AGORA_APP_ID || '';
    const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

    console.log('🔍 Checking Agora credentials:', {
      hasAppId: !!APP_ID,
      appIdLength: APP_ID.length,
      hasCertificate: !!APP_CERTIFICATE,
      certLength: APP_CERTIFICATE.length
    });

    if (!APP_ID) {
      console.error('Missing Agora APP_ID');
      return res.status(500).json({
        error: 'Agora APP_ID not configured'
      });
    }

    // Check if APP_CERTIFICATE is configured
    if (!APP_CERTIFICATE || APP_CERTIFICATE === 'your_app_certificate_here') {
      console.warn('⚠️  APP_CERTIFICATE not configured. Returning null token for testing mode.');
      console.warn('⚠️  In production, you must configure APP_CERTIFICATE in your .env file.');
      console.warn('⚠️  Get it from: https://console.agora.io');

      // Return null token for testing (Agora projects without Primary Certificate enabled)
      return res.json({
        token: null,
        appId: APP_ID,
        channelName,
        uid,
        testMode: true,
        expiresAt: null
      });
    }

    // Token and privilege expiration
    const expirationTimeInSeconds = 3600 * 24; // 24 hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build the token using the correct method signature
    // buildTokenWithUid(appId, appCertificate, channelName, uid, role, tokenExpire, privilegeExpire)
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      expirationTimeInSeconds,
      privilegeExpiredTs
    );

    console.log('✅ Generated voice token:', {
      channelName,
      uid,
      expiresAt: new Date(privilegeExpiredTs * 1000).toISOString()
    });

    res.json({
      token,
      appId: APP_ID,
      channelName,
      uid,
      testMode: false,
      expiresAt: privilegeExpiredTs
    });
  } catch (error: any) {
    console.error('❌ Failed to generate voice token:', error);
    res.status(500).json({
      error: 'Failed to generate token',
      message: error.message
    });
  }
};
