const EndPoints = {
  /* ================= Users ================= */
  'cgGx5E9BSi' : '/get-users-by-primary-property-data',
  'syf17kXJz3' : '/get-academy-scores-data',

  /* ======== Preventative Maintenance ======== */
  'cN46f2Sq99' : '/get-pm-summary-data',
  'PVhahvDlCf' : '/get-completed-pms-data',
  'BN81S5fiU6' : '/get-pm-item-details-data',

  /* ================== Logs ================== */
  '2uBwuBd4UW' : '/get-ada-compliance-data',
  'CgSp3Tctmr' : '/get-daily-deposit-records-data',
  'WbxRg96b3b' : '/get-cashlog-data',
  'CRpzj5RS5b' : '/get-cash-discrepancy-record-data',
  'rJ4XGapX2p' : '/get-guest-package-pickup',
  'Wxu4Q4AXfg' : '/get-key-audit-data',
  'Hf7KV5zbzp' : '/get-key-sign-inout-data',
  'Uj7aUWeu5C' : '/get-mail-check-register-data',
  'VFr9Q8htLz' : '/get-pre-departure-call-audit-data',
  'VJppyvSp6k' : '/get-pre-departure-calls-data',
  '9r5AWeMYVJ' : '/get-property-security-walk-data',
  'qzExJ4a72N' : '/get-room-st-exception-report-data',
  '7vZAbs3Ffk' : '/get-safe-removal-record-data',
  'jvfuxZ2gLR' : '/get-wake-up-call-audit-data',
  '23etZ246Sd' : '/get-wake-up-calls-data',
  'logVendReg' : '/get-vendor-register-report-data',
  'FmTRG9SLRv' : '/get-rebate-log-report-data',
  'Y58sF2QjWm' : '/get-area-temperature-humidity-data',
  '27Kax3Pj8L' : '/get-guest-vehicle-register-data',
  'Hg5LK5M8v6' : '/get-log-book-activity-data',

  /* ================ Readings ================ */
  '9fOUn8o5R3' : '/get-boiler-readings-data',
  'YtQF8tPLTZ' : '/get-pool-readings-data',
  '5dMk2A60ee' : '/get-meter-readings-data',

  /* ================ Requests ================ */
  '7QU9J3oXbp' : '/get-request-summary-data',
  '8Yg7E2iXlf' : '/get-request-average-time-data',
  'Td1xN9pD6r' : '/get-top-requested-items-data',

  /* =============== Work Orders =============== */
  '9qx6976qAS' : '/get-workorder-data',
  'OU812yyz07' : '/get-average-guest-satisfaction-data',
  'XvQ2eJaH4m' : '/get-reported-through-data',
  'OU812yyz04' : '/get-average-workload-data',
  '5O1s7x1P7S' : '/get-top-items-reported-data',
  'iMc3M5OpEz' : '/get-top-25-response-time-data',
  '013lAo8nQE' : '/get-top-areas-reported-data',
  'OU812yyz01' : '/get-issue-summary-by-item-data',
  'TxY5oU4H2B' : '/get-issue-summary-by-item-type-data',
  'TxY7oJ5HiB' : '/get-issue-summary-by-area-data',
  'GxV9oE2HoB' : '/get-average-response-time-by-staff-member',
  'XcK9oE2YoE' : '/get-average-time-summary-by-item-type-data',
  'RcU1nE8JoP' : '/get-average-time-summary-data',
  'QmAVfaoFlo' : '/get-prop-below-workorder-thresholds-data',

  /* =========== Satisfaction Calls =========== */
  'Ac54yM9rE7' : '/get-satisfaction-calls-data',
  'nAP3t8XbR2' : '/get-avg-guest-sat-data',

  /* =============== Complaints =============== */
  'fW6a3Dz8Rh' : '/get-complaints-data',
  'Dv5sK9M7e6' : '/get-compensation-summary-data',
  'OGvFWhfSw1' : '/get-complaints-summary-data',
  'ORiKQrT2oY' : '/get-resolution-summary-data',
  'EXMwQPuH2G' : '/get-pending-complaint-related-activity',
  'yC2sA5fd1A' : '/get-avg-time-resolve-staff-member-data',

  /* ============= Room Cleanings ============= */
  'AX2f5Gk9mD' : '/get-staff-average-score-data',
  '3Tj2Sf7nVa' : '/get-total-failed-items-data',
  'KdZ45g2Am9' : '/get-room-cleanings-data',

  /* ============== Room Notices ============== */
  'rmNoticAll' : '/get-all-room-notices-data',

  /* ================= Sales ================= */
  'nJGSIud786' : '/get-trace-details-data',
  'nJGSIud901' : '/get-trace-tally-data',
  'H7Vf223wGa' : '/get-pace-data',

  /* ================ Connect ================ */
  'Bcw6h7J95a' : '/get-text-summary-data',
  'yB86vE2Qm9' : '/get-guest-requests-data',
  'Mb4D67za2J' : '/get-text-conversations-data',

  /* ================= Tasks ================= */
  'mTd38A2Lcp' : '/get-all-tasks-data',

  /* ================= Inspections ================= */
  'AR5c2HyJ1a' : '/get-inspection-item-details-data',
  'B4dH17uTp5': '/get-pending-inspection-items-data',
  '67B3cKm8e7': '/get-completed-inspection-data',

  /* ================= Cleanings Plus ================= */
  'S3dN7e2kLA' : '/get-avg-cleaning-times-by-attendant-data',
  'CLPactr42' : '/get-avg-cleaning-times-by-room-data',
  'Pj56D2bC6i' : '/get-avg-no-svcs-req-by-day-week-data',
  'VVw23G5m71' : '/get-cleaning-activity-report-data',
  'clplusCTBT' : '/get-cleaning-times-by-cleaning-type-data',
  '99wDg3H4kc' : '/get-avg-inspection-times-data',
  'tD45uH2Ka7' : '/get-cleaning-times-by-room-type-data',
  'clpluMiVRS' : '/get-mins-variance-by-cleaning-type-data',
  '89j2Sc7Rk6' : '/get-mins-variance-by-room-type-data',
  'DzV49yT2Ja' : '/get-productivity-rep-by-cr-assigned-data',
  'Gl4a2WbFs9' : '/get-productivity-rep-by-rm-assigned-data',
  'clplusMVRS' : '/get-mpor-var-by-cleaning-type-data',
  'B2f8y7SD1p' : '/get-mpor-var-by-room-type-data',
  'CLPrcS242' : '/get-end-of-breakout-data',

  /* ============== New Reports ============== */
  'nR99Ua4346' : '/get-user-activity-data',
  'nR99aH625r' : '/get-area-history-data',
  'nCa9c4n3pw' : '/get-lost-found-items-data',
  'nR99aTDi68' : '/get-all-todo-items-data',
  'We3L9Yr1Y5' : '/get-cleanings-inspection-item-details-data',
  'Er7P4Uj5L9' : '/get-cleanings-plus-inspection-item-details-data',

  /* ============== CapEx ============== */
  'capExRep01' : '/get-capex-binder-report',
  'capExRep02' : '/get-capex-forecast-report',
  'capExRep03' : '/get-budget-general-ledger-data',
  'capExRep04' : '/get-budget-actuals-data',
  'capExRep05' : '/get-budget-settings-data',
  'capExRep06' : '/get-txn-checkbook-report-data',
  'capExRep07' : '/get-checkbook-vs-budget-data',
  'capExRep08' : '/get-checkbook-vs-real-budget-data',
  'capExRep09' : '/get-all-capex-request-data',

  /* ============== Quore Admin ============== */
  'HgcvGoQTlX' : '/get-properties-with-sales-data',
  'XoJlEQaxRL' : '/get-properties-with-connect-data',
  'Qa2C7hY66v' : '/get-properties-with-cleanings-plus-data',
  'eJ21Oje9e9' : '/get-email-opt-out-list',
  'tP3LPje7D9' : '/get-activity-log-report-data',
  'AdminUsgRe' : '/get-usagereport'
}

export default EndPoints