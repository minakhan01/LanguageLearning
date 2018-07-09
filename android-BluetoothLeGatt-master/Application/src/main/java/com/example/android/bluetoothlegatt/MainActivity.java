package com.example.android.bluetoothlegatt;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends Activity {
    private Button imageBtn;
    private Button scanBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        imageBtn = (Button) findViewById(R.id.startImages);
        imageBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openImageActivity();
            }
        });

        scanBtn = (Button) findViewById(R.id.scanDevices);
        scanBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openScanActivity();
            }
        });
    }

    public void openImageActivity(){
        Intent intent = new Intent(this, FirebaseActivity.class);
        startActivity(intent);
    }

    public void openScanActivity(){
        Intent intent = new Intent(this, DeviceScanActivity.class);
        startActivity(intent);
    }
}
