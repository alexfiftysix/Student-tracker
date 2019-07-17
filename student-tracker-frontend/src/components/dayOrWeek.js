import React from "react";
import PropTypes from "prop-types";
import withWidth from "@material-ui/core/withWidth/withWidth";
import WeeklyView from "./WeeklyView";
import DailyView from "./DailyView";

function DayOrWeek(props) {
    const {width} = props;
    const date = props.match.params.date;

    return(
        <div>
            {width === 'lg' || width === 'md' ? <WeeklyView start_date={date} /> : <DailyView date={date}/>}
        </div>
    )
}

DayOrWeek.propTypes = {
    width: PropTypes.string.isRequired,
};

export default withWidth()(DayOrWeek);
