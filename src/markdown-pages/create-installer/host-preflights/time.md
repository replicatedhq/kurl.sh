---
path: "/docs/create-installer/host-preflights/time"
date: "2022-01-13"
weight: 27
linktitle: "Time"
title: "Time"
---
 
The time preflight check is can be used to check the system clock, if it's synchronized or not, and the timezone.

# Time Collector

The `time` collector will collect information about the system clock.

## Parameters

The `time` collector accepts the [shared collector properties](https://troubleshoot.sh/docs/collect/collectors/#shared-properties).

# Time Analyzer

The `time` analyzer supports multiple outcomes, by either checking the `ntp` status, or the timezone. For example:

`ntp == unsynchronized+inactive`: System clock is not synchronized.<br/>
`ntp == unsynchronized+active`: System clock not yet synchronized.<br/>
`ntp == synchronized+active`: System clock is synchronized.<br/>
`timezone != UTC`: Non UTC timezone.<br/>
`timezone == UTC`: Timezone is set to UTC.

# Example

Here is an example of how to use the time host preflight check:

```yaml
apiVersion: troubleshoot.sh/v1beta2
kind: HostPreflight
metadata:
  name: time
spec:
  collectors:
    - time: {}
  analyzers:
    - time:
        checkName: "NTP Status"
        outcomes:
            - fail:
                when: "ntp == unsynchronized+inactive"
                message: "System clock is not synchronized"
            - warn:
                when: "ntp == unsynchronized+active"
                message: System clock not yet synchronized                
            - pass:
                when: "ntp == synchronized+active"
                message: "System clock is synchronized"
            - warn: 
                when: "timezone != UTC"
                message: "Non UTC timezone can interfere with system function"
            - pass:
                when: "timezone == UTC"
                message: "Timezone is set to UTC"
```
