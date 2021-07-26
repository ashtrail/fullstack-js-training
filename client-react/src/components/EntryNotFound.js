export default function EntryNotFound(props) {
  return (
    <div>
      <h1 className="title">404</h1>
      {props.value || 'Entry'} not found
    </div>
  )
}
