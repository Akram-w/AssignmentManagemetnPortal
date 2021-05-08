import Subscription from './Subscription'

const Subscriptions = ({ subs, onMessage, onLoad }) => {
    return (
        <>
        {console.log('table',subs)}
            <table className='table' style={{ margin: '10px 10px' }}>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Course Name</th>
                        <th>Accept</th>
                        <th>Banned</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subs.map((module) =>
                            (<Subscription key={module.id} data={module} />))
                    }
                </tbody>
            </table>
        </>
    )
}

export default Subscriptions
