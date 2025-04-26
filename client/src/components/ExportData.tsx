import React from 'react';
import * as ExcelJS from 'exceljs';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const ExportData = ({ data }: any) => {

    // Export historical weather data in Excel format
    const downloadExcel = () => {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Weather Data');

        // Map array keys as table headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add corresponding values to table rows
        data.forEach((item: any) => {
            const values = headers.map((key) => item[key]);
            worksheet.addRow(values);
        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'weather_data.xlsx';
            link.click();
        });
    };

    return (
        <Button onClick={downloadExcel} variant="contained" endIcon={<CloudDownloadIcon />}>
            Download Excel
        </Button>
    );
};

export default ExportData;
