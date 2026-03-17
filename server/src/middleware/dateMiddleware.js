const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};


const parseDateMiddleware = (req, res, next) => {
    if (req.body.dueDate) {
        req.body.dueDate = new Date(req.body.dueDate);
    }
    next();
};


const formatResponsedateMiddleware = (req, res, next) => {
    const oldJson = res.json;
    res.json = function (data) {
        if (Array.isArray(data)) {
            data = data.map(task => ({
                ...task,
                dueDate: task.dueDate ? formatDate(task.dueDate) : null,
            }));
        } else if (typeof data === 'object' && data !== null) {
            data.dueDate = data.dueDate ? formatDate(data.dueDate) : null;
        }
        oldJson.call(this, data);
    };
    next();
};