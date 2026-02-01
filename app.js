const riskData = {
  high: {
    badge: "High Risk",
    headline: "Likely phishing attempt",
    text: "Multiple users reported similar messages and the pattern matches bank impersonation.",
    tips: [
      "Do not share OTPs, PINs, or card details.",
      "Call your bank using the verified directory.",
      "Block the number and submit a report.",
    ],
  },
  medium: {
    badge: "Suspicious",
    headline: "Proceed with caution",
    text: "Some warning signs detected. Verify the sender before taking action.",
    tips: [
      "Check the number against the verified directory.",
      "Avoid clicking unknown links.",
      "Ask for confirmation through official channels.",
    ],
  },
  safe: {
    badge: "Low Risk",
    headline: "No major red flags",
    text: "This number or message does not match known scam patterns.",
    tips: [
      "Stay alert to future changes in tone.",
      "Confirm any financial requests via official lines.",
      "Report anything unusual to protect the community.",
    ],
  },
};

const reportList = document.getElementById("reportList");
const reportForm = document.getElementById("reportForm");
const riskBadge = document.getElementById("riskBadge");
const riskHeadline = document.getElementById("riskHeadline");
const riskText = document.getElementById("riskText");
const riskTips = document.getElementById("riskTips");

const riskTriggers = {
  high: ["otp", "urgent", "verify", "bank", "link", "invoice"],
  medium: ["parcel", "delivery", "click", "security", "update"],
};

const defaultReports = [
  {
    channel: "WhatsApp",
    value: "+27 76 555 0144",
    details: "Claimed I won an investment promotion. Asked for upfront fee.",
  },
  {
    channel: "SMS",
    value: "bit.ly/sa-bank-auth",
    details: "Pretended to be bank verification link.",
  },
];

const renderReport = ({ channel, value, details }) => {
  const wrapper = document.createElement("div");
  wrapper.className = "report-item";
  wrapper.innerHTML = `
    <p><span>${channel}</span> · ${value}</p>
    <p>${details}</p>
  `;
  reportList.prepend(wrapper);
};

defaultReports.forEach(renderReport);

const updateRisk = (level) => {
  const data = riskData[level];
  riskBadge.textContent = data.badge;
  riskBadge.className = `badge ${level}`;
  riskHeadline.textContent = data.headline;
  riskText.textContent = data.text;
  riskTips.innerHTML = data.tips.map((tip) => `<li>${tip}</li>`).join("");
};

const analyzeInput = (value) => {
  const lower = value.toLowerCase();
  if (riskTriggers.high.some((term) => lower.includes(term))) {
    return "high";
  }
  if (riskTriggers.medium.some((term) => lower.includes(term))) {
    return "medium";
  }
  return "safe";
};

document.getElementById("checkRisk").addEventListener("click", () => {
  const input = document.getElementById("lookup").value.trim();
  if (!input) {
    updateRisk("medium");
    riskHeadline.textContent = "Need more information";
    riskText.textContent = "Add a number or message snippet to get a more accurate score.";
    return;
  }
  const level = analyzeInput(input);
  updateRisk(level);
});

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const channel = document.getElementById("reportChannel").value;
  const value = document.getElementById("reportValue").value.trim();
  const details = document.getElementById("reportDetails").value.trim() ||
    "Community member flagged this interaction as suspicious.";

  if (!value) {
    return;
  }

  renderReport({ channel, value, details });
  reportForm.reset();
});
