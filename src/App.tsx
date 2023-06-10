import { Stack, Grid } from '@mui/material'; 
import Calendar from './Calendar';

function App() {
  const getSelectedDates = (selectedDates: Array<number>) => {
    alert(selectedDates);
  }

  return (
    <Stack sx={{ mt: 4 }}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid container>
          <Grid item sm={2} />
          <Grid item sm={8} justifyContent="center">
            <Calendar getSelectedDates={getSelectedDates} />
          </Grid>
          <Grid item sm={2} />
        </Grid>
      </Grid>
    </Stack>
    );
}

export default App;

