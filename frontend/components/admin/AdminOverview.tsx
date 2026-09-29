"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CButton,
  CButtonGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CWidgetStatsA,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilArrowBottom,
  cilArrowTop,
  cilOptions,
  cilCloudDownload,
  cilUser,
  cilUserFemale,
} from "@coreui/icons";
import { CChartLine, CChartBar } from "@coreui/react-chartjs";

export default function AdminOverview() {
  const [period, setPeriod] = useState<"Day" | "Month" | "Year">("Month");

  // CoreUI Table Data
  const tableExample = [
    {
      avatar: { text: "YA", status: "success" },
      user: { name: "Yiorgos Avraamu", new: true, registered: "Mar 15, 2025" },
      country: { name: "USA 🇺🇸" },
      usage: { value: 50, period: "Mar 1, 2026 - Apr 30, 2026", color: "success" },
      payment: { name: "Mastercard" },
      activity: "10 sec ago",
    },
    {
      avatar: { text: "AT", status: "danger" },
      user: { name: "Avram Tarasios", new: false, registered: "Aug 22, 2024" },
      country: { name: "Brazil 🇧🇷" },
      usage: { value: 22, period: "Jan 15, 2026 - Feb 14, 2026", color: "info" },
      payment: { name: "Visa" },
      activity: "5 minutes ago",
    },
    {
      avatar: { text: "QE", status: "warning" },
      user: { name: "Quintin Ed", new: true, registered: "Nov 7, 2024" },
      country: { name: "India 🇮🇳" },
      usage: { value: 74, period: "Feb 10, 2026 - Mar 11, 2026", color: "warning" },
      payment: { name: "Stripe" },
      activity: "1 hour ago",
    },
    {
      avatar: { text: "EK", status: "secondary" },
      user: { name: "Enéas Kwadwo", new: true, registered: "Jan 30, 2025" },
      country: { name: "France 🇫🇷" },
      usage: { value: 98, period: "Apr 1, 2026 - Apr 30, 2026", color: "danger" },
      payment: { name: "PayPal" },
      activity: "Last month",
    },
  ];

  const progressExample = [
    { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
    { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
    { title: "Pageviews", value: "78.706 Views", percent: 60, color: "warning" },
    { title: "New Users", value: "22.123 Users", percent: 80, color: "danger" },
    { title: "Bounce Rate", value: "Average Rate (40.15%)", percent: 40.15, color: "primary" },
  ];

  return (
    <div className="space-y-4">
      {/* 1. CoreUI 4 Widgets Row */}
      <CRow xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="primary"
            value={
              <>
                26K{" "}
                <span className="fs-6 fw-normal">
                  (-12.4% <CIcon icon={cilArrowBottom} />)
                </span>
              </>
            }
            title="Users"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: "#321fdb",
                      data: [65, 59, 84, 84, 51, 55, 40],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  elements: {
                    line: { borderWidth: 2, tension: 0.4 },
                    point: { radius: 4 },
                  },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="info"
            value={
              <>
                $6.200{" "}
                <span className="fs-6 fw-normal">
                  (40.9% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Income"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "My Second dataset",
                      backgroundColor: "transparent",
                      borderColor: "rgba(255,255,255,.55)",
                      pointBackgroundColor: "#3399ff",
                      data: [1, 18, 9, 17, 34, 22, 11],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  elements: {
                    line: { borderWidth: 2, tension: 0.4 },
                    point: { radius: 4 },
                  },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="warning"
            value={
              <>
                2.49%{" "}
                <span className="fs-6 fw-normal">
                  (84.7% <CIcon icon={cilArrowTop} />)
                </span>
              </>
            }
            title="Conversion Rate"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: "70px" }}
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July"],
                  datasets: [
                    {
                      label: "My Third dataset",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  elements: {
                    line: { borderWidth: 2 },
                    point: { radius: 0 },
                  },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color="danger"
            value={
              <>
                44K{" "}
                <span className="fs-6 fw-normal">
                  (-23.6% <CIcon icon={cilArrowBottom} />)
                </span>
              </>
            }
            title="Sessions"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                  <CIcon icon={cilOptions} />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      {/* 2. CoreUI Main Traffic Card */}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">October 2025 - April 2026</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {["Day", "Month", "Year"].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    active={value === period}
                    onClick={() => setPeriod(value as any)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>

          <CChartLine
            style={{ height: "300px", marginTop: "40px" }}
            data={{
              labels: ["January", "February", "March", "April", "May", "June", "July"],
              datasets: [
                {
                  label: "Traffic Primary",
                  backgroundColor: "rgba(51, 153, 255, 0.1)",
                  borderColor: "#3399ff",
                  pointHoverBackgroundColor: "#3399ff",
                  borderWidth: 2,
                  data: [165, 80, 95, 140, 110, 195, 120],
                  fill: true,
                },
                {
                  label: "Traffic Secondary",
                  backgroundColor: "transparent",
                  borderColor: "#2eb85c",
                  pointHoverBackgroundColor: "#2eb85c",
                  borderWidth: 2,
                  data: [190, 95, 105, 160, 130, 205, 145],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, max: 250 },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 2 }}
            sm={{ cols: 2 }}
            md={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={index === items.length - 1 ? "d-none d-md-block" : ""}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold">{item.value}</div>
                <CProgress
                  thin
                  color={item.color as any}
                  value={item.percent}
                  className="mt-2"
                />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>

      {/* 3. CoreUI Users & Activity Table Card */}
      <CCard className="mb-4">
        <CCardHeader className="fw-bold">Users & Activity Stream</CCardHeader>
        <CCardBody>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap font-bold">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Country</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Usage Period</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Payment Method</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {tableExample.map((item, index) => (
                <CTableRow v-for="item in tableItems" key={index}>
                  <CTableDataCell>
                    <div className="d-flex align-items-center gap-2">
                      <div className="fw-bold bg-dark text-white rounded-circle px-2 py-1 fs-6">
                        {item.avatar.text}
                      </div>
                      <div>
                        <div className="fw-bold">{item.user.name}</div>
                        <div className="small text-body-secondary">
                          Registered: {item.user.registered}
                        </div>
                      </div>
                    </div>
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="fw-semibold">{item.country.name}</div>
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="d-flex justify-content-between small text-body-secondary">
                      <span className="fw-bold">{item.usage.value}%</span>
                      <span>{item.usage.period}</span>
                    </div>
                    <CProgress
                      thin
                      color={item.usage.color as any}
                      value={item.usage.value}
                      className="mt-1"
                    />
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="fw-bold">{item.payment.name}</div>
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="small text-body-secondary">{item.activity}</div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
}
