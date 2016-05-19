rsa = {
    publicKey: function (bits, n, e) {
        this.bits = bits;
        this.n = n;
        this.e = e;
    },
    privateKey: function (p, q, d, publicKey) {
        this.p = p;
        this.q = q;
        this.d = d;
        this.publicKey = publicKey;
    },
    generateKeys: function (B) {
        var p, q, n, phi, e, d, keys = {};
        var rng = new SecureRandom();
        var qs = B>>1;
        e = new BigInteger('65537');
        for(;;) {
            for (; ;) {
                p = new BigInteger(B - qs, 1, rng);
                if (p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) == 0 && p.isProbablePrime(10)) break;
            }
            for (; ;) {
                q = new BigInteger(qs, 1, rng);
                if (q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) == 0 && q.isProbablePrime(10)) break;
            }
            if (p.compareTo(q) <= 0) {
                var t = p;
                p = q;
                q = t;
            }
            var p1 = p.subtract(BigInteger.ONE);
            var q1 = q.subtract(BigInteger.ONE);
            phi = p1.multiply(q1);
            if (phi.gcd(e).compareTo(BigInteger.ONE) == 0) {
                n = p.multiply(q);
                d = e.modInverse(phi);
                break;
            }
        }

        keys.publicKey = new rsa.publicKey(B, n , e);
        keys.privateKey = new rsa.privateKey(p, q, d, keys.publicKey);
        return keys;
    }
};


rsa.publicKey.prototype = {
    encrypt: function (m) {
        return m.modPow(this.e, this.n);
    },
    decrypt: function (c) {
        return c.modPow(this.e, this.n);
    }
};

rsa.privateKey.prototype = {
    encrypt: function (m) {
        return m.modPow(this.d, this.publicKey.n);
    },
    decrypt: function (c) {
        return c.modPow(this.d, this.publicKey.n);
    }
};

