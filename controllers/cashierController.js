const cashierModel = require('../models/cashierModel');

// Show list of agents to select for balancing
async function showBalancingForm(req, res) {
    try {
        const agents = await cashierModel.getAllAgents();
        res.render('manager/cashier/select', { agents, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error loading agents');
    }
}

// Show balancing entry screen for a specific agent
async function showBalanceEntry(req, res) {
    try {
        const agentId = req.params.agentId;
        const agents = await cashierModel.getAllAgents();
        const agent = agents.find(a => a.user_id == agentId);
        const totalSales = await cashierModel.getAgentTodaySales(agentId);

        res.render('manager/cashier/balance', { 
            agent, 
            totalSales, 
            user: req.session.user,
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/manager/cashier-balancing');
    }
}

// Submit the balancing
async function submitBalancing(req, res) {
    const { agent_id, total_sales, cash_collected } = req.body;
    try {
        await cashierModel.createBalancing(
            agent_id, 
            total_sales, 
            cash_collected, 
            req.session.user.id
        );
        res.redirect('/manager/cashier-balancing/history');
    } catch (err) {
        console.error(err);
        res.redirect('/manager/cashier-balancing');
    }
}

// View balancing history
async function viewHistory(req, res) {
    try {
        const records = await cashierModel.getAllBalancing();
        res.render('manager/cashier/history', { records, user: req.session.user });
    } catch (err) {
        console.error(err);
        res.send('Error loading history');
    }
}

module.exports = { showBalancingForm, showBalanceEntry, submitBalancing, viewHistory };