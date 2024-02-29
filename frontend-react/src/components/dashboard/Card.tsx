import { FC } from 'react';

interface Props {
    title: string;
    value: number;
}

const Card: FC<Props> = ({ title, value }) => {
    return (
        <div className="w-52 p-2 border-2 border-slate-700 text-center">
            <h2 className="text-2xl">{title}</h2>
            <h2 className="text-2xl font-bold">{value}</h2>
        </div>
    );
};

export default Card;
