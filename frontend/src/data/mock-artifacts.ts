import type { PaperArtifact } from "@/types/artifact";

export const mockPaperArtifacts: PaperArtifact[] = [
  {
    id: "paper-001",
    title:
      "Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing",
    authors: [
      "Ramon Sanchez-Iborra",
      "Abdeljalil Zoubir",
      "Abderahmane Hamdouchi",
      "Ali Idri",
      "Antonio F. Skarmeta",
    ],
    year: 2024,
    publicationType: "Repository",
    abstract:
      "The coordinated integration of heterogeneous TinyML-enabled elements in highly distributed Internet of Things (IoT) environments paves the way for the development of truly intelligent and context-aware applications. In this work, we propose a hierarchical ensemble TinyML scheme that permits system-wide decisions by considering the individual decisions made by the IoT elements deployed in a certain scenario.",
    summary:
      "This paper proposes a hierarchical ensemble TinyML scheme for intelligent IoT applications, integrating heterogeneous TinyML-enabled elements in distributed environments. A two-layered TinyML-based edge computing solution was implemented and evaluated in a real smart-agriculture use case, permitting saving wireless transmissions, reducing energy consumption and response times, while also strengthening data privacy and security.",
    whyItMatters:
      "As IoT deployments scale to thousands of sensors in agricultural fields, the inability to process data locally creates bottlenecks in bandwidth, latency, and privacy. This work demonstrates that heterogeneous edge intelligence—where each sensor node makes preliminary decisions before transmitting—can reduce wireless traffic by orders of magnitude while maintaining system-level accuracy. For precision agriculture, this means real-time interventions are possible without cloud dependency.",
    tags: [
      "TinyML",
      "Edge Computing",
      "IoT",
      "Machine Learning",
      "Precision Agriculture",
      "Energy Efficiency",
    ],
    category: "Repository",
    heatScore: 87,
    readTime: 14,
    keyClaims: [
      "Hierarchical ensemble TinyML reduces wireless transmissions by 73% compared to centralized cloud processing",
      "Two-layered edge architecture achieves 94% system-wide decision accuracy",
      "Energy consumption reduced by 41% through on-device inference before transmission",
      "Response times improved by 68% for time-critical agricultural alerts",
      "Privacy strengthened by processing sensitive crop data locally",
    ],
    experiments: [
      {
        id: "exp-001",
        title: "Deploy hierarchical TinyML ensemble on ESP32 sensor network",
        description:
          "Implement the proposed two-layer TinyML scheme on a network of ESP32-based soil moisture and temperature sensors. Measure transmission reduction, latency, and accuracy compared to baseline cloud-only approach.",
        difficulty: "medium",
        tags: ["TinyML", "ESP32", "IoT"],
      },
      {
        id: "exp-002",
        title: "Benchmark edge vs cloud inference for crop disease detection",
        description:
          "Compare inference latency, accuracy, and energy consumption between on-device TinyML models and cloud-based inference for crop disease detection from leaf imagery.",
        difficulty: "advanced",
        tags: ["Machine Learning", "Edge Computing", "Precision Agriculture"],
      },
      {
        id: "exp-003",
        title: "Simulate hierarchical decision fusion in NS-3",
        description:
          "Model a 100-node agricultural IoT network in NS-3 to simulate hierarchical decision fusion and measure network load reduction under various traffic patterns.",
        difficulty: "medium",
        tags: ["IoT", "Simulation"],
      },
    ],
    sections: [
      {
        id: "sec-001",
        type: "markdown",
        title: "System Architecture",
        content: `## Hierarchical Ensemble TinyML Architecture

The proposed architecture consists of two layers:

### Layer 1: On-Device Inference
Each IoT node runs a lightweight ML model (typically < 250KB) capable of:
- Local feature extraction from raw sensor data
- Preliminary classification decisions
- Confidence scoring for downstream fusion

### Layer 2: Edge Aggregation Node
Edge nodes collect decisions from nearby IoT devices and apply:
- Ensemble fusion algorithms (weighted voting, Bayesian inference)
- Cross-sensor correlation analysis
- System-level decision arbitration

This two-layer approach allows coarse-grained filtering at the edge, dramatically reducing the data that needs to reach cloud infrastructure.`,
      },
      {
        id: "sec-002",
        type: "diagram",
        title: "Decision Flow",
        content: `graph TD
    S[Soil Moisture Sensor] -->|Raw Data| M1[TinyML Model A]
    S -->|Raw Data| M2[TinyML Model B]
    T[Temperature Sensor] -->|Raw Data| M1
    T -->|Raw Data| M2
    M1 -->|Local Decision| E1[Edge Aggregator]
    M2 -->|Local Decision| E1
    E1 -->|Fused Decision| Cloud[Cloud Dashboard]
    E1 -->|Urgent Alert| Alert[Farmer Alert System]`,
      },
      {
        id: "sec-003",
        type: "metrics",
        title: "Performance Results",
        content: `| Metric | Cloud-Only | Hierarchical TinyML | Improvement |
|--------|------------|---------------------|-------------|
| Wireless Transmissions | 12,400/hour | 3,348/hour | 73% ↓ |
| Avg Response Latency | 340ms | 108ms | 68% ↓ |
| Energy per Node/day | 48mWh | 28mWh | 41% ↓ |
| Decision Accuracy | 91% | 94% | 3% ↑ |
| Cloud Bandwidth | 2.1 GB/day | 0.57 GB/day | 73% ↓ |`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-003",
        title:
          "Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning",
        authors: "Jared M. Ping, Ken J. Nixon",
        year: 2024,
        heatScore: 72,
        tags: ["TinyML", "Reinforcement Learning", "Energy Efficiency"],
        reason:
          "Extends TinyML optimization with RL-based power management, complementary to the ensemble approach",
      },
      {
        id: "paper-006",
        title:
          "Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture",
        authors: "Mohamed Shabeer Mohamed Rafi et al.",
        year: 2025,
        heatScore: 65,
        tags: ["IoT", "LPWAN", "5G", "LoRa"],
        reason:
          "Provides connectivity trade-off analysis that pairs well with edge computing architectures",
      },
    ],
    source: "scispace",
    doi: "10.60692/04s37-p4j54",
  },
  {
    id: "paper-002",
    title:
      "Implementation of smart security system in agriculture fields using embedded machine learning",
    authors: [
      "Vanamala Viswanatha",
      "A C Ramachandra",
      "Puneet Hegde",
      "M. V. Raghunatha Reddy",
      "Vivek Hegde",
      "Vageesh Sabhahit",
    ],
    year: 2023,
    publicationType: "Proceedings Article",
    abstract:
      "Tiny Machine Learning (TinyML), a branch of machine learning that focuses on the effectiveness of machine learning on extremely constrained edge machines, is flourishing. This paper proposes an efficient method to detect animals near farmland for security purposes using TinyML and compared with many algorithms and their effectiveness.",
    summary:
      "The paper proposes an efficient method using TinyML to detect animals near farmland for security purposes. This approach addresses challenges of deploying Deep Neural Networks (DNN) models on resource-constrained microcontrollers (MCUs). By leveraging TinyML, the system eliminates the need for cloud computing, enhancing data security and privacy.",
    whyItMatters:
      "Crop raiding by wildlife causes billions in agricultural losses globally. Traditional surveillance requires constant human monitoring or expensive cloud infrastructure. This work demonstrates that animal detection can be performed entirely on-device using models under 250KB, making autonomous farm security economically viable for smallholder farmers.",
    tags: [
      "TinyML",
      "Anomaly Detection",
      "Machine Learning",
      "Embedded Systems",
      "Precision Agriculture",
    ],
    category: "Proceedings Article",
    heatScore: 74,
    readTime: 11,
    keyClaims: [
      "On-device animal detection achieves 91.3% accuracy with models under 250KB",
      "Edge-only processing eliminates cloud subscription costs for farm security",
      "System operates for 45+ days on single battery charge",
      "Detection latency under 50ms enables real-time deterrents",
      "Privacy preserved with no animal imagery transmitted off-farm",
    ],
    experiments: [
      {
        id: "exp-004",
        title: "Train optimized TinyML model for farm animal detection",
        description:
          "Use transfer learning from MobileNetV2 to train a quantized model for detecting common farm raiding animals. Deploy on STM32 and benchmark against full-precision baseline.",
        difficulty: "advanced",
        tags: ["TinyML", "Machine Learning", "Anomaly Detection"],
      },
      {
        id: "exp-005",
        title: "Implement edge-triggered animal deterrent system",
        description:
          "Connect TinyML inference output to relay-controlled deterrents (lights, sounds, sprinklers). Measure response time and animal deterrence effectiveness in field trial.",
        difficulty: "medium",
        tags: ["Embedded Systems", "IoT"],
      },
    ],
    sections: [
      {
        id: "sec-004",
        type: "markdown",
        title: "System Overview",
        content: `## Farm Security with TinyML

### Problem Statement
Wildlife encroachment costs agriculture an estimated $5 billion annually in the US alone. Traditional solutions include:
- Physical fencing (expensive for large areas)
- Human patrols (labor-intensive)
- Cloud-connected cameras (connectivity and subscription costs)

### Proposed Solution
A fully autonomous, edge-deployed animal detection system using:
1. Low-power camera module (OV7670 or equivalent)
2. STM32H7 microcontroller with inline ML accelerator
3. Quantized MobileNet-based classifier (< 250KB)
4. Relay-controlled deterrent outputs

### Key Innovation
Running inference entirely on-device eliminates:
- Monthly cloud fees
- Connectivity requirements
- Privacy concerns about animal imagery leaving the farm`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-001",
        title:
          "Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing",
        authors: "Ramon Sanchez-Iborra et al.",
        year: 2024,
        heatScore: 87,
        tags: ["TinyML", "Edge Computing", "IoT"],
        reason:
          "Provides the hierarchical ensemble framework that could scale this detection system",
      },
    ],
    source: "scispace",
    doi: "10.1109/icaisc58445.2023.10200240",
  },
  {
    id: "paper-003",
    title:
      "Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning in Image-Based Anomaly Detection",
    authors: ["Jared M. Ping", "Ken J. Nixon"],
    year: 2024,
    publicationType: "Preprint",
    abstract:
      "Advances in Tiny Machine Learning (TinyML) have bolstered the creation of smart industry solutions, including smart agriculture. This work extends TinyML research by optimising battery-powered image-based anomaly detection IoT systems using Reinforcement Learning to improve deployment battery life.",
    summary:
      "This preprint investigates optimizing battery-powered image-based anomaly detection IoT systems using Reinforcement Learning (RL). The authors simulate power management policies that dynamically adjust inference frequency and quality based on detected activity levels, extending battery life without sacrificing detection performance.",
    whyItMatters:
      "Battery-powered IoT nodes in agricultural settings must often operate for years without maintenance. Current approaches either run fixed inference schedules (wasting power during quiet periods) or use simple heuristics. This work applies RL to learn adaptive policies that can extend battery life by 2-3x while maintaining detection quality.",
    tags: [
      "TinyML",
      "Reinforcement Learning",
      "Energy Efficiency",
      "Anomaly Detection",
      "Battery-Powered",
    ],
    category: "Preprint",
    heatScore: 72,
    readTime: 16,
    keyClaims: [
      "RL-based power management extends battery life by 156% vs fixed schedules",
      "Adaptive inference frequency maintains 89% detection quality with 40% fewer inferences",
      "Simulated field deployment validates 18-month battery life for anomaly detection nodes",
      "Policy transfer shows 73% of learned behavior generalizes to unseen environments",
    ],
    experiments: [
      {
        id: "exp-006",
        title: "Implement RL power manager on STM32WL sensor node",
        description:
          "Port the simulated RL power policy to an STM32WL-based sensor node. Validate battery life improvement in real-world agricultural deployment over 6-month period.",
        difficulty: "advanced",
        tags: ["Reinforcement Learning", "TinyML", "Energy Efficiency"],
      },
      {
        id: "exp-007",
        title: "Train anomaly detection model with activity-aware quantization",
        description:
          "Train anomaly detection model that dynamically adjusts bit-precision based on scene complexity, saving energy on 'normal' frames.",
        difficulty: "advanced",
        tags: ["Machine Learning", "TinyML", "Anomaly Detection"],
      },
    ],
    sections: [
      {
        id: "sec-005",
        type: "markdown",
        title: "RL Power Management Framework",
        content: `## Reinforcement Learning for Adaptive Inference

### State Space
- Current battery voltage
- Recent inference results (normal/anomaly confidence)
- Time since last anomaly detection
- Ambient light level
- Sensor readings (movement, temperature)

### Action Space
- Inference frequency: 1/second to 1/hour
- Model precision: 8-bit to 32-bit
- Compression level for transmitted anomalies

### Reward Function
\`\`\`
R = α × detection_quality - β × energy_consumption - γ × missed_anomalies
\`\`\`

The RL agent learns to balance detection sensitivity against power conservation, becoming more vigilant when activity is detected and more aggressive in power saving during quiescent periods.`,
      },
      {
        id: "sec-006",
        type: "metrics",
        title: "Battery Life Improvements",
        content: `| Configuration | Avg Current | Battery Life | Detection Quality |
|---------------|-------------|--------------|-------------------|
| Fixed 1/min | 12.3 mA | 6.2 months | 91% |
| Fixed 1/hour | 3.1 mA | 24.8 months | 78% |
| Simple heuristic | 4.8 mA | 16.0 months | 85% |
| RL adaptive (ours) | 2.4 mA | 32.0 months | 89% |`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-001",
        title:
          "Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing",
        authors: "Ramon Sanchez-Iborra et al.",
        year: 2024,
        heatScore: 87,
        tags: ["TinyML", "Edge Computing", "IoT"],
        reason:
          "Complementary ensemble approach could work synergistically with RL power management",
      },
      {
        id: "paper-002",
        title:
          "Implementation of smart security system in agriculture fields using embedded machine learning",
        authors: "Vanamala Viswanatha et al.",
        year: 2023,
        heatScore: 74,
        tags: ["TinyML", "Anomaly Detection"],
        reason:
          "The animal detection use case could benefit from this power optimization approach",
      },
    ],
    source: "arxiv",
    doi: "10.48550/arXiv.2401.12345",
  },
  {
    id: "paper-004",
    title:
      "Towards making the fields talks: A real-time cloud enabled IoT crop management platform for smart agriculture",
    authors: [
      "Navod Neranjan Thilakarathne",
      "Muhammad S. Abu Bakar",
      "Pg Emeroylariffion Abas",
      "Hayati Yassin",
    ],
    year: 2023,
    publicationType: "Journal Article",
    abstract:
      "With the opportunities created by IoT, farmers are now able to monitor the condition of crops in real time. This paper presents a cloud-enabled low-cost sensorized IoT platform for real-time monitoring and automating tasks dealing with a tomato plantation in an indoor environment.",
    summary:
      "This paper presents a cloud-enabled, low-cost sensorized IoT platform for real-time monitoring and automation in smart agriculture, specifically for indoor tomato plantations. The methodology involved deploying IoT sensing devices, Arduino Uno and NodeMCU microcontrollers, and an open-source cloud platform (Thinger.io) to collect and visualize environmental and soil data.",
    whyItMatters:
      "While edge computing is trending, many agricultural operations still benefit from cloud-enabled approaches that provide historical data analysis, remote access, and integration with farm management systems. This work provides a practical template for cloud-integrated IoT deployment that complements edge-native approaches.",
    tags: ["IoT", "Cloud Integration", "Sensor Fusion", "Smart Irrigation"],
    category: "Journal Article",
    heatScore: 58,
    readTime: 12,
    keyClaims: [
      "Multi-sensor fusion (DHT-11, soil moisture, pH, CO2) deployed on Arduino/NodeMCU",
      "Thinger.io cloud integration provides real-time dashboards and automation rules",
      "Automated irrigation increased yield by 23% in tomato trial",
      "System cost under $50 per monitoring station",
      "6-month field trial demonstrated reliability in semi-controlled environment",
    ],
    experiments: [
      {
        id: "exp-008",
        title: "Extend platform with edge preprocessing layer",
        description:
          "Add ESP32-based edge node that filters sensor readings before cloud transmission, reducing bandwidth by 80% while preserving data quality.",
        difficulty: "medium",
        tags: ["IoT", "Edge Computing", "Sensor Fusion"],
      },
    ],
    sections: [
      {
        id: "sec-007",
        type: "markdown",
        title: "Platform Architecture",
        content: `## Cloud-Enabled IoT Platform

### Hardware Stack
- **Sensors**: DHT-11 (temp/humidity), capacitive soil moisture, H-101 pH, MQ-135 CO2, DS18B20, ultrasonic
- **Microcontrollers**: Arduino UNO (analog sensors), NodeMCU ESP8266 (WiFi connectivity)
- **Gateway**: Raspberry Pi (optional edge analytics)

### Cloud Integration
- Platform: Thinger.io (open-source)
- Dashboard: Real-time visualization with historical charts
- Automation: Rule-based actuator control (pumps, lights)

### Key Insight
This platform represents the 'cloud-first' paradigm prevalent in early smart agriculture. Modern systems increasingly add edge preprocessing to reduce cloud dependency while retaining cloud benefits for analytics and remote access.`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-001",
        title:
          "Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing",
        authors: "Ramon Sanchez-Iborra et al.",
        year: 2024,
        heatScore: 87,
        tags: ["TinyML", "Edge Computing", "IoT"],
        reason:
          "Could serve as the edge layer addition to this cloud-first platform",
      },
    ],
    source: "scispace_full_text",
    doi: "10.3389/fpls.2022.1030168",
  },
  {
    id: "paper-005",
    title:
      "LoRa IoT ML-Based Livestock Monitoring in Smart Agriculture",
    authors: [
      "Anonymous Authors",
    ],
    year: 2024,
    publicationType: "Preprint",
    abstract:
      "This paper presents a LoRa-based IoT system for continuous livestock monitoring in smart agriculture. Machine learning algorithms process sensor data to detect behavioral anomalies indicative of health issues or distress.",
    summary:
      "A LoRa-enabled IoT platform for continuous livestock monitoring that uses ML-based anomaly detection on wearable sensor data. The system enables large-area coverage without cellular infrastructure while maintaining acceptable latency for health alerts.",
    whyItMatters:
      "Livestock monitoring is a high-value use case where early disease detection can prevent herd-wide outbreaks. LoRa provides the range needed for free-range grazing while ML on sensor data can detect subtle behavioral changes before visible symptoms appear.",
    tags: ["LoRa", "Machine Learning", "Anomaly Detection", "Livestock"],
    category: "Preprint",
    heatScore: 69,
    readTime: 10,
    keyClaims: [
      "LoRa network covers 10km radius with single gateway",
      "ML anomaly detection identifies early signs of bovine respiratory disease",
      "Battery life of 6+ months on wearable sensor tag",
      "Detection sensitivity of 87% with 12% false positive rate",
    ],
    experiments: [
      {
        id: "exp-009",
        title: "Deploy LoRa livestock network with edge ML processing",
        description:
          "Deploy 50-animal LoRa network with edge-anomaly detection on gateway. Compare accuracy and latency against cloud-only processing.",
        difficulty: "advanced",
        tags: ["LoRa", "Machine Learning", "Anomaly Detection"],
      },
    ],
    sections: [
      {
        id: "sec-008",
        type: "markdown",
        title: "System Architecture",
        content: `## LoRa + ML Livestock Monitoring

### Network Topology
- **Animal Tags**: Accelerometer + temperature + GPS (optional)
- **Gateway**: Raspberry Pi + LoRa hat, handles local ML inference
- **Cloud**: Historical storage, fleet-level analytics

### ML Pipeline
1. Edge: Raw sensor → feature extraction → anomaly score
2. Cloud: Aggregated scores → health trend analysis → vet alerts

### Trade-off
LoRa's long range comes at the cost of low bandwidth (typically < 5 kbps). This necessitates local ML processing rather than transmitting raw sensor streams.`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-003",
        title:
          "Simulating Battery-Powered TinyML Systems Optimised using Reinforcement Learning",
        authors: "Jared M. Ping, Ken J. Nixon",
        year: 2024,
        heatScore: 72,
        tags: ["TinyML", "Reinforcement Learning"],
        reason:
          "RL-based power management could extend battery life for livestock tags",
      },
      {
        id: "paper-006",
        title:
          "Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture",
        authors: "Mohamed Shabeer Mohamed Rafi et al.",
        year: 2025,
        heatScore: 65,
        tags: ["IoT", "LPWAN", "LoRa"],
        reason:
          "Connects to broader LPWAN connectivity analysis for agricultural IoT",
      },
    ],
    source: "arxiv",
    doi: "10.48550/arXiv.2510.07322",
  },
  {
    id: "paper-006",
    title:
      "Reliable and Cost-Efficient IoT Connectivity for Smart Agriculture: A Comparative Study of LPWAN, 5G, and Hybrid Connectivity Models",
    authors: [
      "Mohamed Shabeer Mohamed Rafi",
      "Mehran Behjati",
      "Ahmad Sahban Rafsanjani",
    ],
    year: 2025,
    publicationType: "Preprint",
    abstract:
      "This paper analyzes the performance trade-offs between Low Power Wide Area Networks (LPWAN), specifically LoRaWAN, NB-IoT, and Sigfox, and cellular networks (4G and 5G) in agricultural applications. The findings demonstrate that hybrid LPWAN and 5G models can reduce connectivity costs by up to 30%.",
    summary:
      "A comprehensive comparative study evaluating LPWAN technologies (LoRaWAN, NB-IoT, Sigfox) against cellular (4G/5G) for agricultural IoT. The authors propose hybrid architectures that combine LPWAN for sensor data collection with 5G for high-bandwidth backhaul.",
    whyItMatters:
      "Connectivity is often the deciding factor in agricultural IoT deployments. This study provides concrete guidance on when to use which technology, and introduces hybrid models that capture benefits of both approaches.",
    tags: ["IoT", "LPWAN", "LoRa", "5G", "Cloud Integration"],
    category: "Preprint",
    heatScore: 65,
    readTime: 18,
    keyClaims: [
      "LoRaWAN lowest cost for sparse sensor networks (< 100 nodes/km²)",
      "NB-IoT provides best reliability in dense deployments",
      "Hybrid LPWAN+5G reduces costs by 30% while improving reliability",
      "5G standalone is cost-prohibitive for most agricultural deployments",
      "Real-world testing across 3 agricultural environments validates models",
    ],
    experiments: [
      {
        id: "exp-010",
        title: "Deploy hybrid LPWAN+edge architecture for 1000-node farm",
        description:
          "Design and deploy hybrid network: LoRa for soil sensors, edge compute for aggregation, 5G backhaul for cloud connectivity. Benchmark against single-technology approaches.",
        difficulty: "advanced",
        tags: ["IoT", "LPWAN", "LoRa", "5G", "Edge Computing"],
      },
    ],
    sections: [
      {
        id: "sec-009",
        type: "metrics",
        title: "Technology Comparison Matrix",
        content: `| Technology | Range | Bandwidth | Power | Cost/node/year | Best Use Case |
|------------|-------|-----------|-------|----------------|---------------|
| LoRaWAN | 10+ km | < 50 kbps | Very Low | $1-3 | Sparse soil/moisture sensors |
| NB-IoT | 1-10 km | < 250 kbps | Low | $5-8 | Dense actuator networks |
| Sigfox | 10+ km | < 100 bps | Very Low | $2-4 | Ultra-low-power status updates |
| 4G LTE-M | < 5 km | < 1 Mbps | Medium | $15-25 | High-bandwidth mobile units |
| 5G | < 1 km | > 100 Mbps | High | $50+ | Video analytics, UAV command |

**Hybrid Architecture**: Combine LoRa for sensor collection with cellular for cloud backhaul`,
      },
    ],
    relatedPapers: [
      {
        id: "paper-005",
        title: "LoRa IoT ML-Based Livestock Monitoring in Smart Agriculture",
        authors: "Anonymous",
        year: 2024,
        heatScore: 69,
        tags: ["LoRa", "IoT", "Machine Learning"],
        reason:
          "Real-world deployment context for LoRa technology comparison",
      },
      {
        id: "paper-001",
        title:
          "Intelligent and Efficient IoT Through the Cooperation of TinyML and Edge Computing",
        authors: "Ramon Sanchez-Iborra et al.",
        year: 2024,
        heatScore: 87,
        tags: ["TinyML", "Edge Computing", "IoT"],
        reason:
          "Edge computing architecture that could serve as the local processing layer in hybrid connectivity",
      },
    ],
    source: "arxiv",
    doi: "10.48550/arXiv.2503.11162",
  },
];

export const getArtifactById = (id: string): PaperArtifact | undefined => {
  return mockPaperArtifacts.find((artifact) => artifact.id === id);
};

export const getRelatedArtifacts = (
  id: string,
  limit: number = 4
): PaperArtifact[] => {
  const artifact = getArtifactById(id);
  if (!artifact) return [];

  const relatedIds = artifact.relatedPapers.map((rp) => rp.id);
  return mockPaperArtifacts
    .filter((a) => relatedIds.includes(a.id))
    .slice(0, limit);
};

export const getArtifactsByTag = (tag: string): PaperArtifact[] => {
  return mockPaperArtifacts.filter((artifact) => artifact.tags.includes(tag));
};

export const getArtifactsByCategory = (
  category: string
): PaperArtifact[] => {
  return mockPaperArtifacts.filter(
    (artifact) => artifact.publicationType === category
  );
};

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  mockPaperArtifacts.forEach((artifact) => {
    artifact.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

export const getAllCategories = (): string[] => {
  const categorySet = new Set<string>();
  mockPaperArtifacts.forEach((artifact) => {
    categorySet.add(artifact.publicationType);
  });
  return Array.from(categorySet).sort();
};