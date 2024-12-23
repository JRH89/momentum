import UnsubscribePage from '../../components/utils/Unsubscribe'
import siteMetadata from '../../../siteMetadata'

export const metadata = {
    title: `Unsubscribe | ${siteMetadata.title}`,
    description: `Unsubscribe from ${siteMetadata.title} .`,
    url: `${siteMetadata.siteUrl}/unsubscribe`,
}

const page = () => {
    return (
        <UnsubscribePage />
    )
}

export default page
