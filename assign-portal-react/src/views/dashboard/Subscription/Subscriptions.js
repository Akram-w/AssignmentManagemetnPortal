import Subscription from './Subscription'

const Subscriptions=({subs,onAccept,onClick})=>{
    return (
        <>
        <table className='table' style={{ margin: '10px 10px' }}>
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Accept</th>
                    <th>Banned</th>
                </tr>
            </thead>
            <tbody>
                {
                    subs.map((module) =>
                    (<Subscription key={module.id} onLoad={module} onAccept={onAccept} onClick={onClick}/>))
                }
                {
                    console.log('after')
                }
            </tbody>
        </table>
    </>
    )
}

export default Subscriptions
