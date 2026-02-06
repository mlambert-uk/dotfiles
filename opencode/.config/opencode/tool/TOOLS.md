# OpenCode Notification Tools

Custom tools for sending notifications to Omarchy's mako notification system. These tools integrate with the `omarchy-notifications` skill to provide easy notification functionality in OpenCode workflows.

## Tools Available

### 1. `notify` - Generic Notification Tool

Send notifications with full control over all parameters.

**Parameters:**
- `title` (required): Notification title
- `message` (required): Notification message
- `urgency` (optional, default: "normal"): One of `low`, `normal`, `critical`
- `timeout` (optional): Display duration in milliseconds
- `appName` (optional, default: "OpenCode"): Application name

**Examples:**
```typescript
// Basic notification
notify({
  title: "Build Complete",
  message: "All targets compiled successfully"
})

// Critical alert with timeout
notify({
  title: "Error",
  message: "Database connection failed",
  urgency: "critical",
  timeout: 0  // Sticky notification
})

// Informational with timeout
notify({
  title: "Processing",
  message: "Building project...",
  urgency: "low",
  timeout: 2000  // Disappears after 2 seconds
})
```

### 2. `deployment_buildStatus` - Build Notifications

Specialized tool for build status notifications with automatic urgency handling.

**Parameters:**
- `projectName` (required): Project name
- `success` (required): Boolean indicating build success
- `details` (optional): Additional details/error messages
- `duration` (optional): Build duration (e.g., "2.3s")

**Examples:**
```typescript
// Successful build
deployment_buildStatus({
  projectName: "my-app",
  success: true,
  duration: "2.3s"
})

// Failed build with details
deployment_buildStatus({
  projectName: "my-app",
  success: false,
  details: "TypeScript compilation error in src/index.ts:42",
  duration: "3.1s"
})
```

### 3. `deployment_testResults` - Test Notifications

Send test results with automatic pass/fail indication.

**Parameters:**
- `total` (required): Total number of tests
- `passed` (required): Number of passing tests
- `failed` (optional): Number of failing tests (calculated if not provided)
- `duration` (optional): Test execution duration

**Examples:**
```typescript
// All tests pass
deployment_testResults({
  total: 45,
  passed: 45,
  duration: "3.2s"
})

// Some tests fail
deployment_testResults({
  total: 45,
  passed: 42,
  failed: 3,
  duration: "3.5s"
})
```

### 4. `deployment_deploymentStatus` - Deployment Notifications

Send deployment status updates with environment context.

**Parameters:**
- `environment` (required): One of `staging`, `production`, `development`
- `status` (required): One of `started`, `in-progress`, `complete`, `failed`
- `version` (optional): Version being deployed
- `message` (optional): Additional status message

**Examples:**
```typescript
// Deployment started
deployment_deploymentStatus({
  environment: "production",
  status: "started",
  version: "v1.2.3"
})

// Deployment in progress
deployment_deploymentStatus({
  environment: "production",
  status: "in-progress",
  version: "v1.2.3",
  message: "Rolling out to 50% of servers"
})

// Deployment complete
deployment_deploymentStatus({
  environment: "production",
  status: "complete",
  version: "v1.2.3",
  message: "All servers updated successfully"
})

// Deployment failed
deployment_deploymentStatus({
  environment: "production",
  status: "failed",
  version: "v1.2.3",
  message: "Healthcheck failed on server-03"
})
```

## Usage in OpenCode Workflows

These tools can be called directly in your OpenCode conversations:

**Example: Build and notify**
```
Build my project and send me a notification when done. Use the deployment_buildStatus tool.
```

**Example: Run tests and notify**
```
Run the test suite and send a notification with the results using deployment_testResults.
```

**Example: Deploy with notifications**
```
Deploy to staging and use deployment_deploymentStatus to notify me at each stage.
```

## Integration with Custom Scripts

You can also call these tools from bash scripts:

```bash
#!/bin/bash

# Build the project
if npm run build > build.log 2>&1; then
  notify \
    --title "Build Success" \
    --message "Project compiled in 2.3s" \
    --urgency normal
else
  notify \
    --title "Build Failed" \
    --message "Check build.log for details" \
    --urgency critical
fi
```

## Benefits Over `notify-send` Directly

1. **Type-safe parameters**: Built-in validation
2. **Structured data**: Specialized tools for common scenarios
3. **Consistent formatting**: Automatic formatting and emojis
4. **Error handling**: Built-in error reporting
5. **Integration**: Seamless with OpenCode workflows

## Related

- **Skill**: `/skill omarchy-notifications` - Full documentation and examples
- **Mako config**: `~/.config/mako/config` - Customize notification appearance
- **Omarchy menu**: Setup > Config > Mako - GUI configuration tool
