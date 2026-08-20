import unittest
from types import SimpleNamespace

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db import Base
from app.models import AIModelConfig, DailyUsage
from app.services.admin import DailyLimitExceeded, config_payload, mask_api_key, normalize_model_config, reserve_daily_usage


class AdminServiceTests(unittest.TestCase):
    def setUp(self):
        engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(engine)
        self.session = sessionmaker(bind=engine)()
        self.settings = SimpleNamespace(ai_provider="mock", ai_api_base="", ai_api_key="", ai_model="", daily_parse_limit=20)

    def tearDown(self):
        self.session.close()

    def test_config_payload_masks_persisted_key(self):
        self.session.add(AIModelConfig(id=1, provider="deepseek", api_base="https://api.deepseek.com/v1", model="deepseek-chat", api_key="sk-demo-1234"))
        self.session.commit()
        payload = config_payload(self.session, self.settings)
        self.assertTrue(payload["api_key_configured"])
        self.assertEqual(payload["api_key_mask"], "已配置（末尾 1234）")
        self.assertNotIn("sk-demo", str(payload))
        self.assertEqual(mask_api_key("abc"), "已配置")

    def test_provider_preset_overrides_supplied_base_url(self):
        config = normalize_model_config(self.session, self.settings, "qwen", "qwen-plus", "https://wrong.example/v1", "key")
        self.assertEqual(config.api_base, "https://dashscope.aliyuncs.com/compatible-mode/v1")

    def test_usage_accumulates_and_rejects_entire_overflow(self):
        first = reserve_daily_usage(self.session, self.settings, 18)
        self.assertEqual(first["remaining"], 2)
        self.session.commit()
        with self.assertRaises(DailyLimitExceeded) as raised:
            reserve_daily_usage(self.session, self.settings, 3)
        self.assertEqual(raised.exception.remaining, 2)
        self.session.rollback()
        usage = self.session.query(DailyUsage).one()
        self.assertEqual(usage.accepted_documents, 18)

