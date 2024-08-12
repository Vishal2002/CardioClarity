const { Router } = require('express');
const controller = require('./controller');
const auth = require('./middleware');
// Auth routes
const router=Router();

router.post('/auth/login', controller.login);
router.post('/auth/register', controller.createUser);

// Webhook route
router.post("/consumeTerraWebhook", controller.consumeTerraWebhook);

router.get('/getHealthData',auth,controller.getHealthdata);
router.post('/score/:userId', async (req, res) => {
    try {
      const result = await controller.calculateAndStoreScore(req.params.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/getScoreboard',auth,controller.getScoreboard);
router.get('/getBodyData',auth,controller.getBodyData);
router.get('/getSleepData',auth,controller.getSleepData);
router.get('/getActivityData',auth,controller.getActivitydata);

router.put('/updateTerraId/:userId',controller.updateUserTerraId);

module.exports = router;
