import React from 'react';
import GroupViewItem, { IGroupViewItemProps } from './GroupViewItem';

const GroupViewList = () => {
    const group = 'A';
    const teams = [
        {
            "team_id": "1",
            "mp": "0",
            "w": "0",
            "l": "0",
            "pts": "0",
            "gf": "0",
            "ga": "0",
            "gd": "0",
            "d": "0",
            "name_fa": "قطر",
            "name_en": "Qatar",
            "flag": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Qatar.svg/125px-Flag_of_Qatar.svg.png"
        },
        {
            "team_id": "2",
            "mp": "0",
            "w": "0",
            "l": "0",
            "pts": "0",
            "gf": "0",
            "ga": "0",
            "gd": "0",
            "d": "0",
            "name_fa": "اکوادور",
            "name_en": "Ecuador",
            "flag": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/125px-Flag_of_Ecuador.svg.png"
        },
        {
            "team_id": "3",
            "mp": "0",
            "w": "0",
            "l": "0",
            "pts": "0",
            "gf": "0",
            "ga": "0",
            "gd": "0",
            "d": "0",
            "name_fa": "سنگال",
            "name_en": "Senegal",
            "flag": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/125px-Flag_of_Senegal.svg.png"
        },
        {
            "team_id": "4",
            "mp": "0",
            "w": "0",
            "l": "0",
            "pts": "0",
            "gf": "0",
            "ga": "0",
            "gd": "0",
            "d": "0",
            "name_fa": "هلند",
            "name_en": "Nederland",
            "flag": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/125px-Flag_of_the_Netherlands.svg.png"
        }
    ];
    return (
        <GroupViewItem group={group} teams={teams} />
    )
};

export default GroupViewList;