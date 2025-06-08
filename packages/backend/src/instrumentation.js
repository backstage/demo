// Prevent from running more than once (due to worker threads)
const { isMainThread } = require('node:worker_threads');

if (isMainThread) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
  const {
    OTLPTraceExporter,
  } = require('@opentelemetry/exporter-trace-otlp-http');

  // const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');

  // By default exports the metrics on localhost:9464/metrics
  const prometheusExporter = new PrometheusExporter();
  const otlpTraceExporter = new OTLPTraceExporter();
  // const consoleSpanExporter = new ConsoleSpanExporter();
  const sdk = new NodeSDK({
    metricReader: prometheusExporter,
    traceExporter: otlpTraceExporter,
    // traceExporter: consoleSpanExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
