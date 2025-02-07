import {
    Button,
    Checkbox,
    Column,
    Form,
    Grid,
    Heading,
    Section,
    Select,
    SelectItem,
    TextInput,
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
  } from "@carbon/react";
  import { Search } from "@carbon/icons-react";
  import { React, useState, useEffect } from "react";
  import { FormattedMessage, useIntl } from "react-intl";
  import CustomDatePicker from "../common/CustomDatePicker";
  import PageBreadCrumb from "../common/PageBreadCrumb";
  import { getFromOpenElisServer } from "../utils/Utils";
  
  const breadcrumbs = [{ label: "home.label", link: "/" }];
  
  const ElectronicOrders = ({ setOrders = () => {}, ordersRef }) => {
    const intl = useIntl();
  
    // State
    const [searchType, setSearchType] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusId, setStatusId] = useState("");
    const [useAllInfo, setUseAllInfo] = useState(false);
    const [useAllInfo2, setUseAllInfo2] = useState(false);
    const [orders, setOrdersData] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [hasOrders, setHasOrders] = useState(false);
    const [searchCompleted, setSearchCompleted] = useState(false);
  
    // Table headers
    const headers = [
      { key: 'number', header: 'No.' },
      { key: 'facility', header: intl.formatMessage({ id: 'study.eorder.requester.facility' }) },
      { key: 'patientCode', header: intl.formatMessage({ id: 'study.eorder.patient.code' }) },
      { key: 'upid', header: intl.formatMessage({ id: 'study.eorder.patient.upid' }) },
      { key: 'gender', header: intl.formatMessage({ id: 'study.eorder.patient.gender' }) },
      { key: 'birthDate', header: intl.formatMessage({ id: 'study.eorder.patient.birth_date' }) },
      { key: 'requestDate', header: intl.formatMessage({ id: 'study.eorder.request.date' }) },
      { key: 'collectionDate', header: intl.formatMessage({ id: 'study.eorder.collection.date' }) },
      { key: 'status', header: intl.formatMessage({ id: 'study.eorder.request.status' }) },
      { key: 'testName', header: intl.formatMessage({ id: 'study.eorder.request.test_name' }) },
      { key: 'labNumber', header: intl.formatMessage({ id: 'study.eorder.lab_number' }) },
      { key: 'actions', header: intl.formatMessage({ id: 'study.eorder.action.title' }) }
    ];
  
    useEffect(() => {
      // Load initial data and status options
      getFromOpenElisServer("/rest/ElectronicOrders", handleElectronicOrders);
      getFromOpenElisServer(
        "/rest/displayList/ELECTRONIC_ORDER_STATUSES",
        handleOrderStatus
      );
    }, []);
  
    const handleElectronicOrders = (response) => {
      console.log(response);
    };
  
    const handleOrderStatus = (response) => {
      setStatusOptions(response);
    };
  
    const searchByIdentifier = () => {
      const params = new URLSearchParams({
        searchType: "IDENTIFIER",
        searchValue: searchValue,
        useAllInfo: useAllInfo
      });
  
      getFromOpenElisServer(
        "/rest/ElectronicOrders?" + params.toString(),
        handleSearchResponse
      );
    };
  
    const searchByDateAndStatus = () => {
      const params = new URLSearchParams({
        searchType: "DATE_STATUS",
        startDate: startDate,
        endDate: endDate,
        statusId: statusId,
        useAllInfo: useAllInfo2
      });
  
      getFromOpenElisServer(
        "/rest/ElectronicOrders?" + params.toString(),
        handleSearchResponse
      );
    };
  
    const handleSearchResponse = (response) => {
      setSearchCompleted(true);
      setHasOrders(response.eOrders instanceof Array && response.eOrders.length > 0);
      
      const formattedOrders = response.eOrders.map((order, index) => ({
        id: order.electronicOrderId,
        number: index + 1,
        facility: order.requestingFacility,
        patientCode: order.patientNationalId,
        upid: order.patientUpid,
        gender: order.gender,
        birthDate: order.birthDate,
        requestDate: order.requestDateDisplay,
        collectionDate: order.collectionDateDisplay,
        status: order.status,
        testName: order.testName,
        labNumber: order.labNumber,
        qaEventId: order.qaEventId
      }));
  
      setOrdersData(formattedOrders);
      setOrders(formattedOrders);
  
      if (ordersRef?.current) {
        window.scrollTo({
          top: ordersRef.current.offsetTop - 50,
          left: 0,
          behavior: "smooth"
        });
      }
    };
  
    const handleEdit = (orderId) => {
      window.location.href = `SampleEntryByProject?type=initial&ID=${orderId}`;
    };
  
    const handleReject = (orderId) => {
      // Add reject logic
    };
  
    return (
      <>
        <PageBreadCrumb breadcrumbs={breadcrumbs} />
        
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <Section>
              <Heading>
                <FormattedMessage id="eorder.header" />
              </Heading>
            </Section>
          </Column>
        </Grid>
  
        <Grid fullWidth className="orderLegendBody">
          <Column lg={16}>
            <FormattedMessage id="eorder.search1.text" />
          </Column>
  
          <Column lg={8}>
            <TextInput
              id="searchValue"
              labelText={intl.formatMessage({ id: "eorder.searchValue" })}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchByIdentifier();
              }}
            />
          </Column>
  
          <Column lg={2}>
            <div className="bottomAlign">
              <Checkbox
                id="allInfo1"
                labelText={intl.formatMessage({ id: "eorder.allInfo" })}
                checked={useAllInfo}
                onChange={(e) => setUseAllInfo(e.currentTarget.checked)}
              />
            </div>
          </Column>
  
          <Column lg={4}>
            <Button onClick={searchByIdentifier} renderIcon={Search}>
              <FormattedMessage id="label.button.search" />
            </Button>
          </Column>
  
          <Column lg={16}><hr /></Column>
  
          <Column lg={16}>
            <FormattedMessage id="eorder.search2.text" />
          </Column>
  
          <Column lg={2}>
            <CustomDatePicker
              id="startDate"
              labelText={intl.formatMessage({ id: "eorder.date.start" })}
              value={startDate}
              onChange={setStartDate}
              className="inputDate"
            />
          </Column>
  
          <Column lg={2}>
            <CustomDatePicker
              id="endDate"
              labelText={intl.formatMessage({ id: "eorder.date.end" })}
              value={endDate}
              onChange={setEndDate}
              className="inputDate"
            />
          </Column>
  
          <Column lg={4}>
            <Select
              id="statusId"
              labelText={intl.formatMessage({ id: "eorder.status" })}
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
            >
              <SelectItem 
                value="" 
                text={intl.formatMessage({ id: "study.eorder.all_status" })} 
              />
              {statusOptions.map((option, index) => (
                <SelectItem
                  key={index}
                  value={option.id}
                  text={option.value}
                />
              ))}
            </Select>
          </Column>
  
          <Column lg={2}>
            <div className="bottomAlign">
              <Checkbox
                id="allInfo2"
                labelText={intl.formatMessage({ id: "eorder.allInfo" })}
                checked={useAllInfo2}
                onChange={(e) => setUseAllInfo2(e.currentTarget.checked)}
              />
            </div>
          </Column>
  
          <Column lg={4}>
            <Button onClick={searchByDateAndStatus} renderIcon={Search}>
              <FormattedMessage id="label.button.search" />
            </Button>
          </Column>
  
          {searchCompleted && !hasOrders && (
            <Column lg={16}>
              <FormattedMessage id="eorder.search.noresults" />
            </Column>
          )}
        </Grid>
  
        {hasOrders && (
          <DataTable rows={orders} headers={headers} ref={ordersRef}>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'actions') {
                          return (
                            <TableCell key={cell.id}>
                              <Button
                                kind="ghost"
                                size="sm"
                                onClick={() => handleEdit(row.id)}
                                disabled={row.qaEventId || row.labNumber}
                              >
                                <FormattedMessage id="study.eorder.action.edit" />
                              </Button>
                              <Button
                                kind="ghost"
                                size="sm"
                                onClick={() => handleReject(row.id)}
                                disabled={row.qaEventId || row.labNumber}
                              >
                                <FormattedMessage id="study.eorder.action.reject" />
                              </Button>
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
        )}
      </>
    );
  };
  
  export default ElectronicOrders;