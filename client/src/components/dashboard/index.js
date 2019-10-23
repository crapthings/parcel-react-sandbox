import Flickity from 'flickity'
import 'flickity/dist/flickity.min.css'

import Screen1 from './screen1'
import Screen2 from './screen2'

export default class Dashboard extends Component {
  componentDidMount() {
    this.initFlickity()
  }

  initFlickity = () => {
    this.flky = new Flickity('#dashboard', {
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false
    })
  }

  render() {
    return (
      <div id='dashboard'>
        <div className='screen'>
          <Screen1 />
        </div>
        <div className='screen'>
          <Screen2 />
        </div>
        <div className='screen'>screen3</div>
        <div className='screen'>screen4</div>
      </div>
    )
  }
}
