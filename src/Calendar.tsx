import React from 'react';
import { useEffect, useState } from 'react';
import { Stack, Grid, Typography, Box, Button } from '@mui/material'; 
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface DateDetails {
  month: number, 
  year: number, 
  firstDayOfWeek: number, 
  numberOfDays: number
}

interface BoxData {
  location: string,
  day: number | string,
  data: string,
  year: number,
  selected: boolean
}

interface GetSelectedDates {
  getSelectedDates: (selectedDates: Array<number>) => void;
}


function Calendar( { getSelectedDates } : GetSelectedDates ) {
  const [boxData, setBoxData] = useState<Array<BoxData>>([]);
  const [updateBoxData, setUpdateBoxData] = useState<boolean>(true);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  useEffect(() => {
    if (updateBoxData) {
      setUpdateBoxData(false);
      setBoxData(getBoxData());
    }
    return () => {
      setUpdateBoxData(false);
    }
  }, [boxData]);
  
  function getDateDetails(): DateDetails {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Adding 1 since getMonth() returns zero-based index
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth - 1, 1);
    const dayOfWeek = firstDayOfMonth.getDay();
    const numberOfDays = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
  
    return { month: currentMonth, year: currentYear, firstDayOfWeek: dayOfWeek, numberOfDays: numberOfDays };
  }
  
  const boxClicked = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string, data: BoxData) => {
    // Don't do anything if not on an actual day
    if (data.day === 0) {
      return;
    }
    let newBoxData = [ ...boxData ];
    let box = boxData.find(box => box.location === data.location);
    if (box) {
      box.selected = !box?.selected;
    }
    setBoxData(newBoxData);
    let selected: Array<number> = [];
    boxData.forEach(box => {
      if (box.selected && typeof(box.day) === 'number') 
        selected.push(box.day);
    });
    getSelectedDates(selected);
  }

  function getByKey(obj: any, key: string): string {
    return obj[key];
  }

  function addStringToObject(obj: any, key: string, value: string): void {
    obj[key] = value;
  }

  function getBoxData() : Array<BoxData> { 
    const month_details = getDateDetails();
    let dayCounter = 1;
    const newBoxData: Array<BoxData> = [];
    // Note: day = index + 1
    for (let index = 0; index < 35; index++) {
      const newKey = "calendar" + (index + 1).toString();
      let boxData: BoxData;
      // The firstDayOfWeek is Sunday = 0
      if (index  < month_details.firstDayOfWeek) {
        boxData = { location: newKey, day: 0, year: month_details.year, data: "", selected: false };
      } 
      else if (dayCounter > month_details.numberOfDays) {
        boxData = { location: newKey, day: 0, year: month_details.year, data: "", selected: false };
      }
      else {
        boxData = { location: newKey, day: dayCounter, year: month_details.year, data: dayCounter.toString(), selected: false };
        dayCounter++;
      }
      newBoxData.push(boxData);
    }
    return newBoxData;
  }

  /*
    returns: <Grid item><Box /></Grid>
  */
  function createJSXBox(boxData: BoxData, index: string): JSX.Element {
    let bgColor = "white";
    let color = "black";
    let hoverBG = "lightblue";
    let hoverColor = "white";
    if (boxData.selected) {
      bgColor = "lightgray";
      color = "white";
      hoverBG = "lightgray";
      hoverColor = "white";
    }

    return (
      <Grid item key={"header" + index.toString()}>
        <Box 
          sx={{
            bgcolor: bgColor,
            color: color,
            height: 60, 
            width: 60, 
            border: 1,
            cursor: "pointer",
            ":hover": {
              bgcolor: hoverBG,
              color: hoverColor,
            } 
          }} 
          id={index}
          onClick={(e) => boxClicked(e, index, boxData)}>
          <Typography 
            alignItems={'center'} 
            sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              justifyContent: "center", 
              height: '100%', 
              width: '100%'}}>
            {boxData.data}
          </Typography>
        </Box>
      </Grid>
    );
  }

  function getHeaders() : JSX.Element {
    const daysOfWeek = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    let boxes: Array<JSX.Element> = [];
    daysOfWeek.forEach((header, index) => {
      const headerLocation = "header"+index.toString();
      const boxData = { location: headerLocation, day: header, year: 0, data: header, selected: false };
      boxes.push(createJSXBox(boxData, headerLocation));
    });

    return <Grid item xs={12}><Grid container justifyContent={'center'}>{boxes}</Grid></Grid>;
  }

  function addRowToCalendar(dataContainer: JSX.Element, row: JSX.Element) {
    dataContainer = React.cloneElement(dataContainer, {
      children: (
        <>
          {dataContainer.props.children}
          {row}
        </>
      )
    });
    return dataContainer;
  }

  function getCalendar(): JSX.Element | null {
    let calendarContainer: JSX.Element = <Grid container></Grid>;
    // header (days of week)
    let headerElement = getHeaders();
    calendarContainer = addRowToCalendar(calendarContainer, headerElement);
    // Calendar days
    const allBoxData: Array<BoxData> = boxData;
    let rowOfBoxes: Array<JSX.Element> = [];
    allBoxData.forEach((box, index) => {
      const jsxBox = createJSXBox(box, index.toString());
      rowOfBoxes.push(jsxBox);
      if (rowOfBoxes.length === 7) {
        let rowContainer: JSX.Element = <Grid item xs={12}><Grid container justifyContent={'center'}>{rowOfBoxes}</Grid></Grid>;
        calendarContainer = addRowToCalendar(calendarContainer, rowContainer);
        rowOfBoxes = [];
      }
    });


    return calendarContainer;
  }

  const getCurrentMonth = () => {
     const dateDetails = getDateDetails();
      return dateDetails.month;
  }

  const changeStartDate = () => {
  }
  const changeEndDate = () => {
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack sx={{ mt: 4 }}>
        <Grid container alignItems="center" justifyContent="center">
          <Grid container>
            <Grid item sm={12} justifyContent="center">
              <Typography
                align="center"
                variant="h4"
                style={{ fontWeight: 800 }}
                sx={{ mb: 2 }} >
                {months[getCurrentMonth()]}
              </Typography>
            </Grid>
            <Grid item sm={12} justifyContent="center">
              <DatePicker 
                label="start date" 
                disablePast={true} 
                formatDensity='dense'
                onChange={changeStartDate} 
                sx={{mb: 1, ml: 1, width: "45%"}} />
              <DatePicker 
                label="end date" 
                disablePast={true} 
                formatDensity='dense'
                onChange={changeEndDate} 
                sx={{mb: 1, ml: 1, width: "45%"}} />              
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item sm={12}>
              <div style={{ height: 372, width: '100%' }}>
                {getCalendar()}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </LocalizationProvider>
    );
}

export default Calendar;

