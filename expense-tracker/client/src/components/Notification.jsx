import PropTypes from "prop-types";

export const Notification = ({ type, message, show }) => {
    return (
        <>
            { show && (
                <div className={`row ${type}`}>
                    <div className={`form-content ${type}`}>
                        <p className={`${type}-message`}>{message}</p>
                    </div>
                </div>)
            }
        </>
    )
}

Notification.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
};


export default Notification;