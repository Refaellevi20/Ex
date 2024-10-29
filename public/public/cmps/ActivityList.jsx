// export function ActivityList({ activities, getActivityTime }) {
    
//     if (!activities || !activities.length) {
//         return <p>No activities found.</p>;
//     }

//     return (
//         <ul className='activities-list clean-list'>
//             {activities.map((activity) => (
//                 <li key={activity.at}>
//                     {getActivityTime(activity)}
//                 </li>
//             ))}
//         </ul>
//     )
// }


export function ActivityList({ activities, getActivityTime }) {
    return (
        <ul className='activities-list clean-list'>
            {activities.map((activity, idx) => (
                <li key={activity.at}>
                    {getActivityTime(activity)}
                    {activity.txt}
                </li>
            ))}
        </ul>
    )

}