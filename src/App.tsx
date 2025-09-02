import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ShieldIcon from "@mui/icons-material/Shield";
import DarkModeIcon from "@mui/icons-material/DarkMode";

type Props = { onToggleTheme?: () => void };

export default function App({ onToggleTheme }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [outputs, setOutputs] = useState<null | Record<string, string>>(null);

  const API_BASE = useMemo(() => {
    const vite = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
    const injected = (window as any)?.API_URL_OVERRIDE as string | undefined;
    return (vite || injected || "").replace(/\/$/, "");
  }, []);

  async function handleReframe() {
    setError("");
    setOutputs(null);
    const topic = query.trim();
    if (!topic) {
      setError("Please enter a topic.");
      return;
    }
    setLoading(true);
    try {
      const base = API_BASE || "http://localhost:8000";
      const r = await fetch(`${base}/api/rewrite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: topic }),
      });
      console.log("API_BASE is", base);
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setOutputs(data.outputs || {});
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const labels: Record<string, string> = {
    neutral_summary: "Neutral summary",
    curiosity_headline: "Curiosity headline",
    human_interest: "Human-interest angle",
    economic_lens: "Economic lens",
    sober_bullets: "Sober bullets",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        {/* Header with toggle */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <SparklesIcon color="primary" />
            <Typography variant="h4" fontWeight={800}>
              News Reframer
            </Typography>
          </Box>
          {onToggleTheme && (
            <Tooltip title="Toggle dark/light mode">
              <IconButton onClick={onToggleTheme} color="inherit">
                <DarkModeIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Input card */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Explore responsible angles on any topic" />
          <CardContent>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Get multiple non-persuasive views—neutral summary, human impact, economics,
              and factual bullets. Outputs are AI-generated; verify with primary sources.
            </Typography>

            <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
              <TextField
                fullWidth
                placeholder="e.g., wildfires in California, student loan interest, chip export rules"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleReframe()}
              />
              <Button
                onClick={handleReframe}
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : <TrendingUpIcon />}
              >
                {loading ? "Reframing…" : "Reframe"}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results grid */}
        {outputs && (
          <Grid container spacing={3}>
            {Object.entries(outputs).map(([k, v]) => (
              <Grid item xs={12} sm={6} key={k}>
                <Card>
                  <CardHeader title={labels[k] || k} />
                  <CardContent>
                    {k === "curiosity_headline" ? (
                      <Typography variant="h6" color="primary">
                        {v}
                      </Typography>
                    ) : k === "sober_bullets" ? (
                      <Box component="ul" sx={{ pl: 3, m: 0 }}>
                        {v
                          .split("\n")
                          .map((s) => s.replace(/^[-•]\s*/, "").trim())
                          .filter(Boolean)
                          .map((li, i) => (
                            <Box component="li" key={i}>
                              {li}
                            </Box>
                          ))}
                      </Box>
                    ) : (
                      v.split(/\n\n+/).map((p, i) => (
                        <Typography key={i} variant="body2" paragraph>
                          {p}
                        </Typography>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Footer */}
        <Box mt={5} display="flex" alignItems="center" gap={1}>
          <ShieldIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            This app avoids targeted political persuasion. Headlines aim for honest
            curiosity—no exaggeration.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
