# Agent Autonomous Execution Guidelines

## Autonomy & Decision-Making
- **Execute Directly**: Do not ask for user permission or confirmation before making routine file edits, creating files, installing packages, or running builds/tests.
- **Minimize Interruptions**: Execute multi-step tasks end-to-end autonomously. Do not pause to ask rhetorical questions or ask for permission on expected steps.
- **Only Ask For Critical/Destructive Actions**:
  - Dropping production databases or destructive schema wipes
  - Force-deleting remote git branches or force-pushing over unmerged work
  - Irreversible data deletion
- **Verification**: Run builds and checks proactively to verify code correctness before reporting completion.
