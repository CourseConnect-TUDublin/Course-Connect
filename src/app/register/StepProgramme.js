import {
    TextField, MenuItem, FormGroup, Typography, FormControlLabel,
    Checkbox, RadioGroup, Radio, Box, Button, CircularProgress, useMediaQuery
  } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  
  export default function StepProgramme({
    formData, setFormData, programmes, courses, fetchingProgrammes,
    handleCourseToggle, loading, prevStep, handleSubmit
  }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          select label="Programme" name="programme"
          value={formData.programme} onChange={handleChange}
          fullWidth margin="dense" required disabled={fetchingProgrammes}
          size={isMobile ? "small" : "medium"}
        >
          {fetchingProgrammes
            ? <MenuItem value=""><CircularProgress size={18} sx={{ mr: 1 }} /> Loading…</MenuItem>
            : programmes.length === 0
              ? <MenuItem value="">No programmes found</MenuItem>
              : programmes.map(p => <MenuItem key={p._id} value={p.name}>{p.name}</MenuItem>)
          }
        </TextField>
        <Box
          sx={{
            my: 2,
            p: 1,
            borderRadius: 2,
            border: "1px solid #eee",
            background: "#fafbfc",
            maxHeight: { xs: 180, sm: 240 }, // smaller on mobile, larger on desktop
            overflowY: "auto",
            minHeight: 48,
          }}
        >
          <Typography sx={{ mb: 0.5, fontWeight: 500, fontSize: isMobile ? 15 : 16 }}>
            Select up to 5 Courses
          </Typography>
          <FormGroup>
            {courses.length === 0 && formData.programme && (
              <Typography color="text.secondary" sx={{ mb: 1, fontSize: isMobile ? 13 : 14 }}>
                No courses found
              </Typography>
            )}
            {courses.map(course => (
              <FormControlLabel
                key={course}
                control={
                  <Checkbox
                    size={isMobile ? "small" : "medium"}
                    checked={formData.courses.includes(course)}
                    onChange={() => handleCourseToggle(course)}
                    disabled={
                      !formData.courses.includes(course) && formData.courses.length >= 5
                    }
                  />
                }
                label={<Typography sx={{ fontSize: isMobile ? 13 : 15 }}>{course}</Typography>}
                sx={{
                  m: 0,
                  px: 0.5,
                  "& .MuiFormControlLabel-label": {
                    wordBreak: "break-word"
                  }
                }}
              />
            ))}
          </FormGroup>
        </Box>
        <Typography sx={{ mb: 1, fontWeight: 500, fontSize: isMobile ? 15 : 16 }}>Semester</Typography>
        <RadioGroup
          row={!isMobile}
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          sx={{ mb: 1, flexWrap: "wrap" }}
        >
          <FormControlLabel value="1" control={<Radio size={isMobile ? "small" : "medium"} />} label="Semester 1" />
          <FormControlLabel value="2" control={<Radio size={isMobile ? "small" : "medium"} />} label="Semester 2" />
        </RadioGroup>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1} justifyContent="space-between" mt={2}>
          <Button onClick={prevStep} size={isMobile ? "small" : "medium"} sx={{ minWidth: 90 }}>
            Back
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{ minWidth: 110 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Register"}
          </Button>
        </Box>
      </form>
    );
  }
  