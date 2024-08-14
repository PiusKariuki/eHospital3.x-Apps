import React, { useState } from "react";
import styles from "./home-dashboard.scss";
import {useTranslation} from "react-i18next";
import PatientQueueIllustration from "./patient-queue-illustration.component";
import MetricsCard from "./dashboard-card/dashboard-card.component";
import {
  DatePicker,
  DatePickerInput,
  Tile,
  SkeletonPlaceholder,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  DataTableSkeleton,
  Pagination,
  Link,
  Layer,
  Tab,
  Tabs,
  TabList,
  IconSwitch,
} from "@carbon/react";
import { ChartLineSmooth, Table as TableIcon } from "@carbon/react/icons";
import {useOPDPatientList} from "../hooks/useOPDPatientList";
import HomeDashboardChart from "./home-dashboard-chart.component";

type PatientVisistsReportHomeProps = {
  patientUuid?: string;
};

const PatientVisitsReportHome: React.FC<PatientVisistsReportHomeProps> = () => {
  const {t} = useTranslation();
  const [searchString, setSearchString] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [chartActive, setChartActive] = useState(false);
  const [listActive, setListActive] = useState(true);
  const [consultation, setConsultation] = useState(false);
  const [dental, setDental] = useState(false);
  const [ultraSound, setUltraSound] = useState(false);
  const [pharmacy, setPharmacy] = useState(false);
  const [laboratory, setLaboratory] = useState(false);
  const [opdVisits, setOpdVisits] = useState(false);
  const [opdRevisits, setOpdRevisits] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const {
    isLoading,
    data,
    setDateRange,
    dateRange,
    totalPatients,
    totalOpdVisits,
    totalOpdRevisits,
    summary
  } = useOPDPatientList();

  const tableData = [
    {
      header: t('name', 'Name'),
      key: 'fullName',
    },
    {
      header: t('age', 'Age'),
      key: 'age',
    },
    {
      header: t('gender', 'Gender'),
      key: 'gender',
    },
    {
      header: t('opdNumber', 'OPD Number'),
      key: 'opdNumber',
    },
    {
      header: t('id', 'ID'),
      key: 'openmrsID',
    },
    {
      header: t('diagnosis', 'Diagnosis'),
      key: 'diagnosis',
    }
  ]

  const filteredData = data?.filter((patient) => {
    return patient.diagnosis?.toLowerCase().includes(searchString.toLowerCase())
  })

  const getConsultations = () => {
    setConsultation(true);
    setDental(false);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('consultation');
  }

  const getDental = () => {
    setConsultation(false);
    setDental(true);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('dental');
  }

  const getUltraSound = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(true);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('ultrasound');
  }

  const getPharmacy = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(false);
    setPharmacy(true);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('pharmacy');
  }

  const getLaboratory = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(true);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('laboratory');
  }

  const getOpdVisits = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(true);
    setOpdRevisits(false);
    setActiveFilter('opdVisits');
  }

  const getOpdRevisits = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(true);
    setActiveFilter('opdRevisits');
  }

  const getAll = () => {
    setConsultation(false);
    setDental(false);
    setUltraSound(false);
    setPharmacy(false);
    setLaboratory(false);
    setOpdVisits(false);
    setOpdRevisits(false);
    setActiveFilter('all');
  }
  
  const rowData = filteredData?.map((patient) => {
    return {
      id: patient.openmrsID,
      fullName: () => (
        <Link
          href={`${window.getOpenmrsSpaBase()}patient/${
            patient.uuid
          }/chart/Patient%20Summary`}
        >
          {patient.fullName}
        </Link>
      ),
      openmrsID: patient.openmrsID,
      gender: patient.gender,
      age: patient.age,
      opdNumber: patient.opdNumber,
      diagnosis: patient.diagnosis,
      consultation: patient.consultation,
      dental: patient.dental,
      ultraSound: patient.ultraSound,
      opdVisits: patient.opdVisits,
      opdRevisits: patient.opdRevisits
    }
  }) || [];

  const filteredRowData = rowData?.filter((patient) => {
    if (!consultation && !dental && !ultraSound && !opdVisits && !opdRevisits) {
      return true;
    } else if (consultation && patient.consultation) {
      return true;
    } else if (dental && patient.dental) {
      return true;
    } else if (ultraSound && patient.ultraSound) {
      return true;
    } else if (opdVisits && patient.opdVisits) {
      return true;
    } else if (opdRevisits && patient.opdRevisits) {
      return true;
    }

    return false;
  })

  const paginatedData = filteredRowData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activateChart = () => {
    setChartActive(true);
    setListActive(false);
  }

  const activateList = () => {
    setChartActive(false);
    setListActive(true);
  }

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div
          style={{
            width: "100%"
          }}
        >
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles["page-labels"]}>
                <p className={styles.title}>{t("outPatient", "Out Patient")}</p>
              </div>
            </div>
          </div>
          <div
            className={styles.cardContainer}
            data-testid="registered-patients"
          >
            <Tile className={styles.tileContainer}>
              <SkeletonPlaceholder />
            </Tile>
          </div>
          <br/>
          <DataTableSkeleton columns={tableData?.length} rows={5} />
        </div>
      ) : (
        <>
          <div className={styles.header} data-testid="patient-queue-header">
            <div className={styles["left-justified-items"]}>
              <PatientQueueIllustration/>
              <div className={styles.pageLabels}>
                <p className={styles.title}>{t("outPatient", "Out Patient")}</p>
              </div>
            </div>
          </div>

         
          <div className={styles.homeContainer}>
            <div className={styles.cardContainerParent} data-testid="clinic-metrics">
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalPatients.toString()}
                headerLabel={t("totalOPDVisits", "Total Patients")}
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOpdVisits.toString()}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Visits")}
              />
              <MetricsCard
                className="metricsCard"
                label={t("total", "Total")}
                value={totalOpdRevisits.toString()}
                headerLabel={t("totalOPDVisitsForPeriod", "Total OPD Re-visits")}
              />
            </div>

            <div className={styles.dashboardIcons}>
              <div>
                <Tabs>
                  <TabList contained>
                    <Tab onClick={getAll}>All</Tab>
                    <Tab onClick={getOpdVisits}>OPD Visits</Tab>
                    <Tab onClick={getOpdRevisits}>OPD Re-visits</Tab>
                    <Tab onClick={getConsultations}>Consultation</Tab>
                    <Tab onClick={getDental}>Dental</Tab>
                    <Tab onClick={getUltraSound}>Ultra Sound</Tab>
                    <Tab onClick={getPharmacy}>Pharmacy</Tab>
                    <Tab onClick={getLaboratory}>Laboratory</Tab>
                  </TabList>
                </Tabs>
              </div>

              <div className={styles.iconSwitch}>
                <IconSwitch 
                  name="tableView" 
                  text="Table view" 
                  onClick={activateList}
                  style={{
                    backgroundColor: listActive ? "#2357871A" : "",
                  }}
                >
                  <TableIcon size={16} />
                </IconSwitch>
                <IconSwitch 
                  name="chartView" 
                  text="Chart view" 
                  onClick={activateChart}
                  style={{
                    backgroundColor: chartActive ? "#2357871A" : "",
                  }}
                >
                  <ChartLineSmooth size={16} />
                </IconSwitch>
              </div>
            </div>

            {listActive && (<div className={styles.datatable}>
              <h1 className={styles.tableTitle}></h1>
              <DataTable
                useZebraStyles={true}
                rows={paginatedData}
                headers={tableData}
              >
                {({ rows, headers, getRowProps, getTableProps }) => (
                  <TableContainer {...getTableProps()} className={styles.table}>
                    <TableToolbar className={styles.tableToolbar}>
                      <TableToolbarContent className={styles.tableToolbarContent}>
                        <TableToolbarSearch
                          onChange={(e) => setSearchString(e.target.value)}
                          placeholder={t("searchByDiagnosis", "Search by Diagnosis")}
                        />
                        <div className={styles.listFilter}>
                          <DatePicker
                            onChange={(value) =>
                              setDateRange({start: value[0], end: value[1]})
                            }
                            value={[dateRange.start, dateRange.end]}
                            datePickerType="range"
                            dateFormat="d/m/Y"
                            className={styles.filterDatePicker}
                          >
                            <DatePickerInput
                              id="date-picker-input-id-start"
                              placeholder="dd/mm/yyyy"
                              labelText="Start date"
                              size="md"
                            />
                            <DatePickerInput
                              id="date-picker-input-id-finish"
                              placeholder="dd/mm/yyyy"
                              labelText="End date"
                              size="md"
                            />
                          </DatePicker>
                        </div>
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table className={styles.tableBody}>
                      <TableHead>
                        <TableRow>
                          {headers.map((col) => (
                            <TableHeader key={col.key}>{col.header}</TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => {
                          return (<TableRow
                            key={row.id}
                            {...getRowProps({row})}
                           >
                            {row.cells.map((cell, index) => (
                              <TableCell key={index}>{typeof cell.value === 'function' ? cell.value() : cell.value}</TableCell>
                            ))}
                          </TableRow>)
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
              {filteredRowData?.length === 0 && (
                <div className={styles.emptyStateText}>
                  <Layer level={0}>
                    <Tile className={styles.emptyStateTile}>
                      <p className={styles.filterEmptyStateContent}>
                        {t('noData', 'No data to display. Please select a date range to fetch data.')}
                      </p>
                    </Tile>
                  </Layer>
                </div>
              )}
              <Pagination 
                totalItems={rowData.length}
                backwardText={t("previous", "Previous")}
                forwardText={t("next", "Next")}
                itemsPerPageText={t("itemsPerPage", "Items per page:")}
                page={currentPage}
                pageSize={itemsPerPage}
                pageSizes={[10, 20, 30, 40, 50]}
                onChange={({page, pageSize}) => {
                  setCurrentPage(page);
                  setItemsPerPage(pageSize);
                }}
              />
            </div>)}

            {chartActive && (
              <HomeDashboardChart 
                summary={summary} 
                dateRange={dateRange} 
                setDateRange={setDateRange} 
                activeFilter={activeFilter}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientVisitsReportHome;
