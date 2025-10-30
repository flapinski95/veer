package com.veer.gateway;

import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.UUID;

/* Utility class for JWT generation in tests. */
public class JwtTestUtils {

    private static final KeyPair keyPair = generateRsaKey();

    public static KeyPair getKeyPair() {
        return keyPair;
    }

    public static String createToken(String issuer) {
        JwtEncoder encoder = TestJwtEncoders.create(keyPair);
        JwsHeader headers = JwsHeader.with(SignatureAlgorithm.RS256).build();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer) // Must match issuer in tests
                .subject(UUID.randomUUID().toString())
                .claim("email", "test-user@veer.com")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .audience(Collections.singletonList("veer-client"))
                .build();

        return encoder.encode(JwtEncoderParameters.from(headers, claims)).getTokenValue();
    }


    private static KeyPair generateRsaKey() {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            return keyPairGenerator.generateKeyPair();
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }

    // Helper method to create JWKS JSON from a KeyPair
    public static String generateJwks(KeyPair keyPair) {
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        String n = Base64.getUrlEncoder().encodeToString(publicKey.getModulus().toByteArray());
        String e = Base64.getUrlEncoder().encodeToString(publicKey.getPublicExponent().toByteArray());

        return "{\"keys\":[{\"kty\":\"RSA\",\"kid\":\"test-kid\",\"use\":\"sig\",\"alg\":\"RS256\",\"n\":\"" + n + "\",\"e\":\"" + e + "\"}]}";
    }
}
