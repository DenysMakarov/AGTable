import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ListFilter, AtSign, Phone, Globe, Ruler, Clock } from 'lucide-react';
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
      headerComponentParams: {
        template: 
          `<div class="ag-cell-label-container" role="presentation">
             <div class="ag-header-cell-label" role="presentation">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="M21 6H3"/><path d="M7 12H3"/><path d="M3 18h4"/><path d="M21 18h-4"/><path d="M11 12h4"/><path d="M21 12h-2"/></svg>
               <span ref="eText" class="ag-header-cell-text">Company Size</span>
             </div>
           </div>`
      }
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
      headerComponentParams: {
        template: 
          `<div class="ag-cell-label-container" role="presentation">
             <div class="ag-header-cell-label" role="presentation">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
               <span ref="eText" class="ag-header-cell-text">Markets</span>
             </div>
           </div>`
      }
    },
    {
      headerName: 'Email',
      field: 'contactEmail',
      filter: true,
      sortable: true,
      headerComponentParams: {
        template: 
          `<div class="ag-cell-label-container" role="presentation">
             <div class="ag-header-cell-label" role="presentation">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"></path></svg>
               <span ref="eText" class="ag-header-cell-text">Email</span>
             </div>
           </div>`
      }
    },
    {
      headerName: 'Phone',
      field: 'contactPhone',
      filter: true,
      sortable: true,
      headerComponentParams: {
        template: 
          `<div class="ag-cell-label-container" role="presentation">
             <div class="ag-header-cell-label" role="presentation">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
               <span ref="eText" class="ag-header-cell-text">Phone</span>
             </div>
           </div>`
      }
    },
    {
      headerName: 'Last Updated',
      field: 'lastUpdated',
      filter: true,
      sortable: true,
      headerComponentParams: {
        template: 
          `<div class="ag-cell-label-container" role="presentation">
             <div class="ag-header-cell-label" role="presentation">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
               <span ref="eText" class="ag-header-cell-text">Last Updated</span>
             </div>
           </div>`
      }
    },
  ], []);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 150,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressMenu: false,
    icons: {
      filter: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-filter-icon lucide-list-filter"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>'
    }
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
    const value = e.target.value;
    setQuickFilterText(value);
    if (gridApi) {
      gridApi.setFilterModel({
        operatorName: { type: 'contains', filter: value },
        companyName: { type: 'contains', filter: value },
        companySize: { type: 'contains', filter: value },
        markets: { type: 'contains', filter: value },
        contactEmail: { type: 'contains', filter: value },
        contactPhone: { type: 'contains', filter: value }
      });
      gridApi.onFilterChanged();
    }
  }, [gridApi]);

  const onStatusFilterChange = useCallback((status: string) => {
    setStatusFilter(status);
    if (gridApi) {
      if (status === 'All') {
        gridApi.setFilterModel(null);
      } else {
        gridApi.setFilterModel({
          consentStatus: {
            type: 'equals',
            filter: status
          }
        });
      }
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
          value={quickFilterText}
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
          enableCellTextSelection={true}
          ensureDomOrder={true}
        />
      </div>
    </div>
  );
};

export default OperatorTable; 