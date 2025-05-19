// Prevent from running more than once (due to worker threads)
const { isMainThread } = require('node:worker_threads');

if (isMainThread) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const {
    getNodeAutoInstrumentations,
  } = require('@opentelemetry/auto-instrumentations-node');
  const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

  // By default exports the metrics on localhost:9464/metrics
  const prometheusExporter = new PrometheusExporter();
  const sdk = new NodeSDK({
    // You can add a traceExporter field here too
    metricReader: prometheusExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
}
