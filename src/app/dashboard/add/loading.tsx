import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading(){
    return (
        <div className='max-w-sm mx-auto pt-8 px-2'>
            <Skeleton className='mb-4' height={60} width={500} />
            <Skeleton height={20} width={150} />
            <Skeleton height={60} width={150} />
        </div>

    )
}