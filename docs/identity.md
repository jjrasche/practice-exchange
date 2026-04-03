# Identity System

## Architecture

DID-based pseudonymous identity. Users own their cryptographic identity. Platform never holds private keys. Your DID is persistent, portable, and accumulates reputation through your actions.

## Pseudonymity Model

- Every user has a DID (Decentralized Identifier) -- a globally unique cryptographic identity
- The DID is not tied to a real name, face, or location
- Content is depersonalized (standardized format removes visual/audio identity markers)
- The DID accumulates contribution history, attestations, and learning history
- Other users see a consistent identity with a track record, but not a legal name
- Users can optionally attach real-world credentials to their DID

## How It Works

1. User creates account -> keypair generated on user's device
2. Private key stored encrypted in browser storage (WebCrypto API for v1)
3. Public key published in DID Document (JSON file)
4. Every user action is cryptographically signed
5. Anyone can verify a signature came from a DID

## DID Document

Public. Contains:
- Public key (for signature verification)
- Service endpoints (where to reach the user)
- Authentication methods
- Recovery manifest (guardian DIDs, not shards)

NOT sensitive. Knowing someone's DID Document is like knowing their mailing address. Cannot be used to impersonate -- only the private key can sign.

## Implementation Path

### v1: Email Auth + WebCrypto

- Email + passphrase authentication (simple, familiar)
- WebCrypto API generates a software-level key for signing
- Key stored encrypted in IndexedDB
- DID Document hosted at practice.exchange
- Software-level security (not hardware-backed) -- acceptable for v1
- **Key recovery (v1):** If browser data is cleared, the IndexedDB key is lost. Mitigation: encrypted key backup to server -- user's passphrase encrypts the key client-side, server stores the encrypted blob, server can never decrypt without the passphrase. Social recovery with guardians replaces this in v2.

### v2: DID with did:web

- DID Document hosted at practice.exchange/.well-known/did.json
- One JSON file per user on platform server
- Social recovery guardians active
- Simple, fully controlled, no external dependencies

### v3: Own PLC Directory

- Run our own DID resolution service
- Users get DIDs like did:plc:abc123
- Open-source, mirrorable by other nodes
- Analogous to DNS for identity

### v4: Federation

- Other nodes can run compatible PLC directories
- Users can migrate DIDs between nodes
- Identity + data travel together

## Key Rotation Path (v1 -> Hardware-Backed)

The transition from software keys to hardware-backed keys is clean:

1. v1: WebCrypto generates software key, stored encrypted in IndexedDB
2. Later: user installs native wrapper (or PWA gains WebAuthn signing)
3. New hardware-backed key generated in device Secure Enclave
4. User signs a "key rotation" transaction with OLD software key, declaring NEW hardware key as current
5. DID Document updates to point to new public key
6. Old software key revoked

This is a standard DID key rotation -- built into the DID spec. Social recovery guardians are not involved unless the old key is lost. No engineering dead-end.

## Social Recovery

### Setup
- User generates key -> splits into 5 shards (Shamir's Secret Sharing)
- Distributes shards to 5 chosen guardians
- Each guardian stores their shard in their device's secure storage
- Recovery manifest (list of guardian DIDs) stored in DID Document

### Recovery Flow
1. User loses device
2. New device generates temporary keypair
3. Platform looks up recovery manifest, notifies guardians
4. Guardian receives notification, independently verifies it is really the user (phone call, in person, video chat -- human verification, not algorithmic)
5. Guardian approves -> their shard encrypted to new device's temporary public key
6. 3 of 5 shards received -> private key reconstructed on new device
7. User re-shards and can redistribute to new/same guardians

### Guardian Heartbeat
- Platform pings guardians periodically
- 30-day inactivity triggers warning to user
- User prompted to add replacement guardian to maintain 3-of-5 safety margin
- Guardians can be replaced at any time by re-sharding

### Key Properties
- Platform never touches assembled private key
- Guardians verify identity through human means (not algorithmic)
- 5 guardians with 3-of-5 threshold (configurable)
- Periodic "review your guardians" prompt (every 6-12 months)
- Old shards become useless on re-shard
- Social recovery is a human security primitive -- resistant to AI social engineering

## Reputation

No separate reputation score. Contribution history IS reputation:
- Every circle participated in (verifiable, signed)
- Every peer attestation received (Verifiable Credentials)
- Every session published (timestamped, signed)
- Governance participation (votes, proposals, signed)

This is portable. Leave the platform, take your reputation with you. Join a different node, your attestations follow.

Matching algorithm uses this data to improve matches. Never surfaces as a leaderboard, score, or ranking.

## Capability Passport (v2+)

Peer-attested Verifiable Credentials:
- "These 4 people attest that this person demonstrated X capability"
- Cryptographically signed by attestors
- Portable -- travels with the DID across any federated node
- Accumulates across all circles
- Not a grade, not a certificate -- a peer-witnessed verification