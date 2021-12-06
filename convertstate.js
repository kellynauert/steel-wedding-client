/* eslint-disable no-undef */
this.props = {};
defaultStats = '';
let classState = {
  guests: [],
  filteredGuests: [],
  open: false,
  groups: [],
  openDialog: false,
  newGuest: null,
  role: this.props.role,
  stats: defaultStats,
  search: [],
  searchTerm: '',
};

let functional = Object.keys(classState).map(
  (key) =>
    `const [${key},set${
      key.charAt(0).toUpperCase() + key.slice(1)
    }] = useState(${JSON.stringify(classState[key])})`
);
functional.forEach((item) => console.log(item));
