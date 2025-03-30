import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import '../styles/OperatorTable.css';
import Switcher from './Switcher';

interface OperatorData {
  operatorName: string;
  companyName: string;
  companySize: string;
  markets: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  consentStatus: string;
  lastUpdated: string;
}

const OperatorTable: React.FC = () => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [rowData, setRowData] = useState<OperatorData[]>([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [switcherRect, setSwitcherRect] = useState({ left: 0, width: 0 });
  const switcherRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const statusOptions = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Blocked', label: 'Blocked' }
  ];

  useEffect(() => {
    const activeButton = switcherRefs.current.find(
      (ref) => ref?.classList.contains('active')
    );
    if (activeButton) {
      setSwitcherRect({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [statusFilter]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    {
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      flex: 0,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: 'left',
    //   headerName: 'All',
      suppressMenu: true,
      sortable: false,
      filter: false,
    },
    {
      headerName: 'Operator Name',
      field: 'operatorName',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Company Name',
      field: 'companyName',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Company Size',
      field: 'companySize',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Status',
      field: 'consentStatus',
      filter: true,
      sortable: true,
      cellClass: (params) => ['status-cell', `status-${params.value.toLowerCase().replace(/\s+/g, '-')}`],
    },
    {
      headerName: 'Markets',
      field: 'markets',
      filter: true,
      sortable: true,
      valueFormatter: (params) => {
        if (Array.isArray(params.value)) {
          return params.value.join(', ');
        }
        return params.value || '';
      },
    },
    {
      headerName: 'Email',
      field: 'contactEmail',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Phone',
      field: 'contactPhone',
      filter: true,
      sortable: true,
    },
    {
      headerName: 'Last Updated',
      field: 'lastUpdated',
      filter: true,
      sortable: true,
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    resizable: true,
    sortable: true,
    floatingFilter: true,
  }), []);

  useEffect(() => {
    fetch('/operator-consent-table.json')
      .then(response => response.json())
      .then(jsonData => {
        const parsedData: OperatorData[] = jsonData.map((item: any) => ({
          operatorName: item.operatorName,
          companyName: item.companyName,
          companySize: item.companySize,
          markets: item.markets,
          contactName: item.contactInformation.name,
          contactEmail: item.contactInformation.email,
          contactPhone: item.contactInformation.phone,
          consentStatus: item.latestConsentStatus,
          lastUpdated: item.lastConsentUpdate
        }));
        setRowData(parsedData);
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
        setRowData([
          {
            operatorName: "Operator A",
            companyName: "Company A",
            companySize: "1-50",
            markets: ["US", "EU"],
            contactName: "John Doe",
            contactEmail: "john@example.com",
            contactPhone: "+1234567890",
            consentStatus: "Active",
            lastUpdated: "2024-03-20"
          }
        ]);
      });
  }, []);

  const onFilterTextBoxChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickFilterText(e.target.value);
    if (gridApi) {
      gridApi.setFilterModel({
        operatorName: { type: 'contains', filter: e.target.value },
        companyName: { type: 'contains', filter: e.target.value },
        companySize: { type: 'contains', filter: e.target.value },
        markets: { type: 'contains', filter: e.target.value },
        contactName: { type: 'contains', filter: e.target.value },
        contactEmail: { type: 'contains', filter: e.target.value },
        contactPhone: { type: 'contains', filter: e.target.value }
      });
    }
  }, [gridApi]);

  const onStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
    if (gridApi) {
      gridApi.setFilterModel({
        consentStatus: status === 'All' ? null : {
          type: 'equals',
          filter: status
        }
      });
    }
  }, [gridApi]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="filters-panel">
        <input
          type="text"
          placeholder="Search..."
          onChange={onFilterTextBoxChanged}
          className="search-input"
        />
      </div>
      <Switcher 
        options={statusOptions}
        value={statusFilter}
        onChange={onStatusFilterChange}
      />
      <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 160px)', width: '100%' }}>
        <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          rowSelection="multiple"
          enableRangeSelection={true}
          animateRows={true}
          rowDragManaged={true}
          suppressMoveWhenRowDragging={false}
        />
      </div>
    </div>
  );
};

export default OperatorTable; 