const isVoteSelected = (item, vote, loggedUser) => {
    const userVoted = item.usersVoted.find(
        _userVoted =>
            _userVoted.id === loggedUser?.id &&
            _userVoted.SuggestionVote2User.vote === vote
    );

    return !!userVoted;
};

export default isVoteSelected;
