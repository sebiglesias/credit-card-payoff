
function calc() {
  const bal = parseFloat(document.getElementById('balance').value) || 0;
  const apr = (parseFloat(document.getElementById('apr').value) || 0) / 100 / 12;
  const targetPay = parseFloat(document.getElementById('paymentPlan').value) || 0;

  if (bal <= 0) return;

  // Fixed monthly target payoff
  let m = 0;
  let cur = bal;
  let intPaid = 0;
  while (cur > 0.01 && m < 480) {
    let monthlyInt = cur * apr;
    let prin = targetPay - monthlyInt;
    if (prin <= 0) {
      document.getElementById('monthsToPay').innerText = "Never";
      document.getElementById('totalInterest').innerText = "Infinite";
      document.getElementById('verdictBox').innerHTML = "⚠️ Your payment is lower than the monthly interest accrued. You will never pay this off.";
      return;
    }
    if (prin > cur) prin = cur;
    cur -= prin;
    intPaid += monthlyInt;
    m++;
  }

  // Minimum payment calculation (typically higher of $35 or 1% principal + interest)
  let minM = 0;
  let minCur = bal;
  let minInt = 0;
  while (minCur > 15 && minM < 480) {
    let monthlyInt = minCur * apr;
    let minPay = Math.max(35, (minCur * 0.01) + monthlyInt);
    let prin = minPay - monthlyInt;
    minCur -= prin;
    minInt += monthlyInt;
    minM++;
  }

  document.getElementById('monthsToPay').innerText = m + ' mos';
  document.getElementById('totalInterest').innerText = '$' + Math.round(intPaid).toLocaleString();
  document.getElementById('minTime').innerText = (minM / 12).toFixed(1) + ' yrs';
  document.getElementById('minCost').innerText = '$' + Math.round(minInt).toLocaleString();

  const saved = Math.max(0, minInt - intPaid);
  document.getElementById('verdictBox').innerHTML = 
    `By committing <strong>$${targetPay}/mo</strong>, you save <strong>$${Math.round(saved).toLocaleString()}</strong> in interest and become debt-free <strong>${((minM - m)/12).toFixed(1)} years sooner</strong> than paying the bank's minimums.`;
}

['balance', 'apr', 'paymentPlan'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (document.getElementById(id + 'Range')) {
      document.getElementById(id + 'Range').value = document.getElementById(id).value;
    }
    calc();
  });
});

['balanceRange', 'aprRange', 'paymentPlanRange'].forEach(id => {
  const targetId = id.replace('Range', '');
  document.getElementById(id).addEventListener('input', (e) => {
    document.getElementById(targetId).value = e.target.value;
    calc();
  });
});

calc();
