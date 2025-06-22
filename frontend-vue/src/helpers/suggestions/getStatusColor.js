import { SuggestionStatuses } from '@/enums/SuggestionStatuses';

const getStatusColor = item => {
    const colors = {
        [SuggestionStatuses.PENDING]: 'orange',
        [SuggestionStatuses.VOTING]: 'blue',
        [SuggestionStatuses.ACCEPTED]: 'green',
        [SuggestionStatuses.REJECTED]: 'red',
        [SuggestionStatuses.IMPLEMENTED]: 'purple'
    };

    return colors[item.status];
};

export default getStatusColor;
