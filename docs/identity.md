# Identity System

## Architecture

DID-based identity. Users own their cryptographic identity. Platform never holds private keys.

## How It Works

1. User creates account -> platform generates keypair on user's device
2. Private key stored in device secure enclave (biometric-gated)
3. Public key published in DID Document (JSON file)
4. Every user action is cryptographically signed
5. Anyone can verify a signature came from a DID
6. DID reveals nothing personal — pseudonymous by default

## DID Document

Public. Contains:
- Public key (for signature verification)
- Service endpoints (where to reach the user)
- Authentication methods
- Recovery manifest (guardian DIDs, not shards)

NOT sensitive. Knowing someone's DID Document is like knowing their mailing address. Cannot be used to impersonate — only the private key can sign.

## Implementation Path

### Phase 1: did:web
- DID Document hosted at practice.exchange/.well-known/did.json
- One JSON file per user on platform server
- Simple, fully controlled, no external dependencies

### Phase 2: Own PLC Directory
- Run our own DID resolution service
- Users get DIDs like did:plc:abc123
- Open-source, mirrorable by other nodes
- Analogous to DNS for identity

### Phase 3: Federation
- Other nodes can run compatible PLC directories
- Users can migrate DIDs between nodes
- Identity + data travel together

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
4. Guardian receives notification, independently verifies it's really the user (phone call, in person, etc.)
5. Guardian approves -> their shard encrypted to new device's temporary public key
6. 3 of 5 shards received -> private key reconstructed on new device
7. User re-shards and can redistribute to new/same guardians

### Guardian Heartbeat
- Platform pings guardians periodically ("are you still active?")
- 30-day inactivity triggers warning to user
- User prompted to add replacement guardian to maintain 3-of-5 safety margin
- Guardians can be replaced at any time by re-sharding

### Key Properties
- Platform never touches assembled private key
- Guardians verify identity through human means (not algorithmic)
- 5 guardians with 3-of-5 threshold (configurable)
- Periodic "review your guardians" prompt (every 6-12 months)
- Old shards become useless on re-shard

## Reputation

No separate reputation score. Contribution history IS reputation:
- Every circle participated in (verifiable, signed)
- Every peer attestation received (Verifiable Credentials)
- Every trail published (timestamped, signed)
- Governance participation (votes, proposals, signed)

Matching algorithm uses this data to improve matches. Never surfaces as a leaderboard or score.

## Capability Passport

Peer-attested Verifiable Credentials:
- "These 4 people attest that this person demonstrated X capability"
- Cryptographically signed by attestors
- Portable — travels with the DID across any federated node
- Accumulates across all circles and subdomains
- Not a grade, not a certificate — a peer-witnessed verification
