export default function LoadingData() {
  return (
    <div>
      <p>Loading data...</p>
      <progress className="progress is-primary" max="100">
        70%
      </progress>
    </div>
  )
}
