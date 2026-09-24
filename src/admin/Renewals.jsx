
import { useMemo, useState } from "react";
import "./Renewals.css";
import { useInsuranceContext } from "./InsuranceContext";

const columns = [
  { key: "timestamp", label: "Submitted" },
  { key: "customerName", label: "Customer Name" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "vehicleNumber", label: "Vehicle Number" },
  { key: "policyExpiryDate", label: "Policy Expiry Date" },
  { key: "vehicleType", label: "Vehicle Type" },
  { key: "previousPolicy", label: "Previous Policy" },
];

const renewalFilters = [
  { key: "all", label: "All", days: null },
  { key: "month", label: "1 Month Renewal", days: 30 },
  { key: "fifteenDays", label: "15 Day Renewal", days: 15 },
  { key: "week", label: "1 Week Renewal", days: 7 },
];

// =====================================================
// CSV PARSER
// =====================================================
function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"' && line[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }

  cells.push(cell.trim());

  return cells;
}

// =====================================================
// HEADER NORMALIZATION
// =====================================================
function toKey(header) {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// =====================================================
// HEADER ALIASES
// =====================================================
const headerAliases = {
  timestamp: [
    "submitted",
    "timestamp",
    "date",
    "issuedate",
  ],

  customerName: [
    "customername",
    "customer",
    "name",
  ],

  mobileNumber: [
    "mobilenumber",
    "mobile",
    "phone",
    "phonenumber",
    "contact",
  ],

  vehicleNumber: [
    "vehiclenumber",
    "vehicleno",
    "registrationnumber",
    "registrationno",
  ],

  policyExpiryDate: [
    "policyexpirydate",
    "expirydate",
    "expiry",
    "expiredate",
    "expireddate",
  ],

  vehicleType: [
    "vehicletype",
  ],

  previousPolicy: [
    "previouspolicy",
    "policydocument",
    "previouspolicydocument",
  ],
};

// =====================================================
// DATE PARSER
// =====================================================
function parseExpiryDate(value) {
  if (!value || value === "-") {
    return null;
  }

  const text = String(value).trim();

  // YYYY-MM-DD
  const isoMatch = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (isoMatch) {
    const [, year, month, day] = isoMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Slash-separated dates can be DD/MM/YYYY or MM/DD/YYYY.
  const slashMatch = text.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
  );

  if (slashMatch) {
    const [, first, second, year] = slashMatch;
    const firstNumber = Number(first);
    const secondNumber = Number(second);
    const month = firstNumber > 12 ? secondNumber : firstNumber;
    const day = firstNumber > 12 ? firstNumber : secondNumber;

    const date = new Date(
      Number(year),
      month - 1,
      day
    );

    // Reject impossible dates instead of allowing Date to roll them over.
    return date.getFullYear() === Number(year) &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
      ? date
      : null;
  }

  // Final fallback
  const parsedDate = new Date(text);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

// =====================================================
// FORMAT DATE
// =====================================================
function formatDate(value) {
  const date = parseExpiryDate(value);

  if (!date) {
    return value || "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// =====================================================
// RENEWAL WINDOW
// =====================================================
function isWithinRenewalWindow(value, days) {
  const expiryDate = parseExpiryDate(value);

  if (!expiryDate) {
    return false;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(today);

  lastDate.setDate(lastDate.getDate() + days);

  expiryDate.setHours(0, 0, 0, 0);

  return (
    expiryDate >= today &&
    expiryDate <= lastDate
  );
}

// =====================================================
// DAYS LEFT
// =====================================================
function getDaysLeft(value) {
  const expiryDate = parseExpiryDate(value);

  if (!expiryDate) {
    return null;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const difference =
    expiryDate.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

// =====================================================
// WHATSAPP URL
// =====================================================
function getWhatsAppUrl(renewal) {
  let digits = String(
    renewal.mobileNumber || ""
  ).replace(/\D/g, "");

  // 09876543210
  if (
    digits.length === 11 &&
    digits.startsWith("0")
  ) {
    digits = digits.slice(1);
  }

  // 919876543210
  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    digits = digits.slice(2);
  }

  // Must be 10 digit Indian number
  if (
    digits.length !== 10 ||
    !/^[6-9]\d{9}$/.test(digits)
  ) {
    return "";
  }

  const phoneNumber = `91${digits}`;

  const expiryDate = formatDate(
    renewal.policyExpiryDate
  );

  const message = [
    `Hello ${renewal.customerName || "Customer"},`,
    "",
    "Your vehicle insurance renewal is due soon.",
    "",
    `Vehicle: ${renewal.vehicleNumber || "-"}`,
    `Policy Expiry Date: ${expiryDate}`,
    "",
    "Please contact Maa Bhagwati Insurance for renewal assistance.",
    "",
    "Maa Bhagwati Insurance",
  ].join("\n");

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
}

// =====================================================
// PARSE RENEWALS FROM CONTEXT ROWS
// =====================================================
function parseRenewalRow(policy) {
  const row = policy?.data || [];
  const headerKeys = (policy?.headerKeys || []).map((header) => header);

  return columns.reduce(
    (renewal, column, index) => {
      const acceptedHeaders =
        headerAliases[column.key] || [
          toKey(column.label),
        ];

      const headerIndex = headerKeys.findIndex(
        (header) => acceptedHeaders.includes(header)
      );

      const fallbackIndex =
        column.key === "timestamp" ? 0 : index;

      renewal[column.key] =
        row[
          headerIndex >= 0 ? headerIndex : fallbackIndex
        ] || "-";

      return renewal;
    },
    {}
  );
}

// =====================================================
// RENEWALS COMPONENT
// =====================================================
function Renewals() {
  const { policies, loading } = useInsuranceContext();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState("all");

  const renewals = useMemo(
    () =>
      policies
        .map((policy) => parseRenewalRow(policy))
        .filter((renewal) => Object.keys(renewal).length > 0),
    [policies]
  );

  const error = !loading && !policies.length ? "No renewal records available." : "";

  // ===================================================
  // SELECTED FILTER
  // ===================================================
  const selectedFilter = renewalFilters.find(
    (filter) =>
      filter.key === activeFilter
  );

  // ===================================================
  // FILTER RECORDS
  // ===================================================
  const filteredRenewals = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return renewals.filter((renewal) => {
      // Search
      const matchesSearch =
        !searchText ||
        Object.values(renewal)
          .join(" ")
          .toLowerCase()
          .includes(searchText);

      // Date filter
      let matchesDate = true;

      if (
        selectedFilter &&
        selectedFilter.days !== null
      ) {
        matchesDate =
          isWithinRenewalWindow(
            renewal.policyExpiryDate,
            selectedFilter.days
          );
      }

      return (
        matchesSearch && matchesDate
      );
    });
  }, [
    renewals,
    search,
    selectedFilter,
  ]);

  // ===================================================
  // COUNT
  // ===================================================
  const totalRenewals =
    filteredRenewals.length;

  // ===================================================
  // RENDER
  // ===================================================
  return (
    <div className="renewals-container">

      {/* ================= HEADING ================= */}
      <div className="renewals-heading">
        <div>
          <p className="renewals-eyebrow">
            Admin records
          </p>

          <h2>
            Renewal Requests
          </h2>
        </div>

        <span className="renewals-count">
          {totalRenewals} requests
        </span>
      </div>

      {/* ================= SEARCH ================= */}
      <input
        className="search-input"
        type="search"
        placeholder="Search by customer, vehicle, mobile..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      {/* ================= FILTER BUTTONS ================= */}
      <div
        className="renewal-filter-buttons"
        role="group"
        aria-label="Filter renewal dates"
      >
        {renewalFilters.map((filter) => (
          <button
            key={filter.key}
            className={`renewal-filter-button ${
              activeFilter === filter.key
                ? "active"
                : ""
            }`}
            type="button"
            aria-pressed={
              activeFilter === filter.key
            }
            onClick={() =>
              setActiveFilter(filter.key)
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <p className="renewals-message error">
          {error}
        </p>
      )}

      {/* ================= LOADING ================= */}
      {loading && (
        <p className="renewals-message">
          Loading renewal requests...
        </p>
      )}

      {/* ================= TABLE ================= */}
      {!loading &&
        !error && (
          <div className="table-responsive">
            <table className="renewals-table">

              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>
                      {column.label}
                    </th>
                  ))}

                  <th>
                    Days Left
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {filteredRenewals.length > 0 ? (
                  filteredRenewals.map(
                    (renewal, index) => {
                      const daysLeft =
                        getDaysLeft(
                          renewal.policyExpiryDate
                        );

                      const whatsappUrl =
                        getWhatsAppUrl(
                          renewal
                        );

                      return (
                        <tr
                          key={`${renewal.vehicleNumber}-${index}`}
                        >

                          {/* ================= COLUMNS ================= */}
                          {columns.map(
                            (column) => (
                              <td
                                key={
                                  column.key
                                }
                                data-label={
                                  column.label
                                }
                              >
                                {column.key ===
                                "policyExpiryDate"
                                  ? formatDate(
                                      renewal[
                                        column.key
                                      ]
                                    )
                                  : renewal[
                                      column.key
                                    ]}
                              </td>
                            )
                          )}

                          {/* ================= DAYS LEFT ================= */}
                          <td data-label="Days Left">

                            {daysLeft ===
                            null ? (
                              "-"
                            ) : daysLeft === 0 ? (
                              <strong>
                                Today
                              </strong>
                            ) : daysLeft === 1 ? (
                              <strong>
                                1 Day
                              </strong>
                            ) : daysLeft > 1 ? (
                              `${daysLeft} Days`
                            ) : (
                              "Expired"
                            )}

                          </td>

                          {/* ================= WHATSAPP ================= */}
                          <td data-label="Action">

                            {whatsappUrl ? (
                              <a
                                className="renewal-whatsapp-button"
                                href={
                                  whatsappUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                WhatsApp
                              </a>
                            ) : (
                              <button
                                className="renewal-whatsapp-button unavailable"
                                type="button"
                                disabled
                              >
                                Unavailable
                              </button>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td
                      className="renewals-empty"
                      colSpan={
                        columns.length + 2
                      }
                    >
                      No renewal requests found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

export default Renewals;
