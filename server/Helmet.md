#Utilisez Helmet

##Goal
Helmet helps you to protect your API served via TLS by configuring correctly HTTP headers.

##Prerequisites
Activate TLS:

* Add this to your main js: const tls = require('spdy');
* In the command line:
    - Generate a RSA key pair:
        
        `openssl genrsa -out test-key.pem 2048`
    - Generate a Certificate Signing Request (CSR):
        
        `openssl req -new -sha256 -key test-key.pem -out test-csr.pem`
    - Once the CSR file is generated, it can either be sent to a Certificate Authority for signing (Production environment) or used to generate a self-signed certificate (Development Environment).
    - For Development Environments:
        + Create a self-signed certificate:
            
            `openssl x509 -req -in test-csr.pem -signkey test-key.pem -out test-cert.pem`
        + Once the certificate is generated, it can be used to generate a .pfx or .p12 file:
            
            `openssl pkcs12 -export -in test-cert.pem -inkey test-key.pem -certfile test-cert.pem -out test.pfx`
* Now, when your run your application, you need to specify the trusted cipher suites:
        
        `node --tls-cipher-list="ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384" main.js`

* Generate another RSA key pair for token signing and then extract the public key form the pem file:
    
    `openssl rsa -in token-key.pem -pubout -out token-public-key.pem`

* Add these lines to your main.js
        
        const fs = require('fs');
        var helmet = require('helmet');
        const options = {
            key: fs.readFileSync('./tls/test-key.pem'),
            cert: fs.readFileSync('./tls/test-cert.pem')
        };
        main.use(helmet());
  
* Now, when you launch your app, your will activate the libraries of Helmet  
##Functionality
Helmet is actually a bunch of libraries that help to enhance the security of your TLS confidential communication:

* csp defines the `Content-Security-Policy` header for protection against XSS (Cross-Site Scripting) attacks and other injection attacks.
* hidePoweredBy delete the `X-Powered-By` header.
* hpkp add des the Public Key Pinning headers (épinglage de clé publique) to resist impersonation by attackers using mis-issued or otherwise fraudulent certificates.
* hsts defines the `Strict-Transport-Security` header to protect against protocol downgrade attacks and cookie hijacking.
 It allows web servers to declare that web browsers (or other complying user agents) should interact with it using only secure HTTPS connections, and never via the insecure HTTP protocol.
* ieNoOpen defines `X-Download-Options` header for IE8+.
* noCache defines `Cache-Control` and `Pragma` headers to prevent the client from caching the server responses.
* noSniff defines `X-Content-Type-Options` header to protect browsers from sniffing response MIME code by declaring the content type.
* frameguard defines `X-Frame-Options` header to protect against clickJacking.
* xssFilter defines `X-XSS-Protection` header to activate the XSS filter in recent browsers.