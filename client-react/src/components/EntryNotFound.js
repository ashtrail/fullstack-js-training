export default function EntryNotFound() {
  return (
    <div>
      <h1 className="title">404</h1>
      {this.props.value || 'Entry'} not found
    </div>
  )
}
